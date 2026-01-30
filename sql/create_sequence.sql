-- Create sequences
CREATE SEQUENCE wo_sequence START 1;

CREATE SEQUENCE as_sequence START 1;

-- Grant permissions on sequences
GRANT USAGE,
SELECT
,
UPDATE
    ON SEQUENCE wo_sequence TO cmms_db;

GRANT USAGE,
SELECT
,
UPDATE
    ON SEQUENCE as_sequence TO cmms_db;