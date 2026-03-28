-- ShelterMap Initial Database Schema
-- Creates shelters and sms_logs tables with constraints, indexes, and RLS policies

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create capacity status enum
CREATE TYPE capacity_status AS ENUM ('GREEN', 'YELLOW', 'RED');

-- Create shelters table
CREATE TABLE shelters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    region TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    max_capacity INTEGER NOT NULL,
    current_occupancy INTEGER NOT NULL DEFAULT 0,
    pin_hash TEXT NOT NULL,
    coordinator_phone TEXT NOT NULL,
    status capacity_status NOT NULL DEFAULT 'GREEN',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT shelters_occupancy_non_negative CHECK (current_occupancy >= 0),
    CONSTRAINT shelters_occupancy_within_capacity CHECK (current_occupancy <= max_capacity),
    CONSTRAINT shelters_max_capacity_non_negative CHECK (max_capacity >= 0),
    CONSTRAINT shelters_latitude_range CHECK (latitude >= -90 AND latitude <= 90),
    CONSTRAINT shelters_longitude_range CHECK (longitude >= -180 AND longitude <= 180),
    CONSTRAINT shelters_phone_e164 CHECK (coordinator_phone ~ '^\+63\d{10}$'),
    CONSTRAINT shelters_pin_hash_length CHECK (LENGTH(pin_hash) = 60)
);

-- Create sms_logs table
CREATE TABLE sms_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shelter_id UUID NOT NULL REFERENCES shelters(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    recipient TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('sent', 'failed')),
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Indexes
    CONSTRAINT sms_logs_recipient_e164 CHECK (recipient ~ '^\+63\d{10}$')
);

-- Create indexes for performance
CREATE INDEX idx_shelters_region ON shelters(region);
CREATE INDEX idx_shelters_status ON shelters(status);
CREATE INDEX idx_shelters_is_active ON shelters(is_active);
CREATE INDEX idx_shelters_updated_at ON shelters(updated_at);
CREATE INDEX idx_sms_logs_shelter_id ON sms_logs(shelter_id);
CREATE INDEX idx_sms_logs_sent_at ON sms_logs(sent_at);

-- Function to compute capacity status
CREATE OR REPLACE FUNCTION compute_capacity_status(
    current_occ INTEGER,
    max_cap INTEGER
) RETURNS capacity_status AS $$
BEGIN
    IF max_cap = 0 THEN
        RETURN 'GREEN';
    END IF;
    
    DECLARE
        percent DECIMAL := (current_occ::DECIMAL / max_cap::DECIMAL) * 100;
    BEGIN
        IF percent >= 90 THEN
            RETURN 'RED';
        ELSIF percent >= 70 THEN
            RETURN 'YELLOW';
        ELSE
            RETURN 'GREEN';
        END IF;
    END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to automatically update status on INSERT/UPDATE
CREATE OR REPLACE FUNCTION update_shelter_status()
RETURNS TRIGGER AS $$
BEGIN
    NEW.status := compute_capacity_status(NEW.current_occupancy, NEW.max_capacity);
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_shelter_status
    BEFORE INSERT OR UPDATE OF current_occupancy, max_capacity
    ON shelters
    FOR EACH ROW
    EXECUTE FUNCTION update_shelter_status();

-- Enable Row Level Security
ALTER TABLE shelters ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public can SELECT shelters (excluding pin_hash)
CREATE POLICY "Public read access to shelters"
    ON shelters
    FOR SELECT
    TO public
    USING (is_active = true);

-- RLS Policy: LGU admins have full access to shelters
CREATE POLICY "LGU admin full access to shelters"
    ON shelters
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'lgu_admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'lgu_admin');

-- RLS Policy: LGU admins can read sms_logs
CREATE POLICY "LGU admin read access to sms_logs"
    ON sms_logs
    FOR SELECT
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'lgu_admin');

-- RLS Policy: Service role can write to sms_logs (for Edge Functions)
CREATE POLICY "Service role write access to sms_logs"
    ON sms_logs
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Create a view that excludes pin_hash for public access
CREATE OR REPLACE VIEW public_shelters AS
SELECT 
    id,
    name,
    address,
    region,
    latitude,
    longitude,
    max_capacity,
    current_occupancy,
    coordinator_phone,
    status,
    is_active,
    created_at,
    updated_at
FROM shelters
WHERE is_active = true;

-- Grant access to the view
GRANT SELECT ON public_shelters TO anon, authenticated;

-- Insert sample data for testing
INSERT INTO shelters (
    name,
    address,
    region,
    latitude,
    longitude,
    max_capacity,
    current_occupancy,
    pin_hash,
    coordinator_phone
) VALUES
    (
        'Barangay Hall Evacuation Center',
        '123 Main St, Manila',
        'NCR',
        14.5995,
        120.9842,
        200,
        50,
        '$2b$10$rKZvVqVvVqVvVqVvVqVvVuO7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z',
        '+639171234567'
    ),
    (
        'City Sports Complex',
        '456 Sports Ave, Quezon City',
        'NCR',
        14.6760,
        121.0437,
        500,
        380,
        '$2b$10$rKZvVqVvVqVvVqVvVqVvVuO7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z',
        '+639181234567'
    ),
    (
        'Elementary School Gymnasium',
        '789 School Rd, Pasig',
        'NCR',
        14.5764,
        121.0851,
        300,
        275,
        '$2b$10$rKZvVqVvVqVvVqVvVqVvVuO7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z',
        '+639191234567'
    );

COMMENT ON TABLE shelters IS 'Evacuation centers with capacity tracking';
COMMENT ON TABLE sms_logs IS 'SMS alert delivery logs';
COMMENT ON FUNCTION compute_capacity_status IS 'Computes GREEN/YELLOW/RED status based on occupancy percentage';
