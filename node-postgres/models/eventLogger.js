const pool = require("pg").Pool;

async function logEvent(entityId, entityType, eventType, description) {
    try {
        const eventTimestamp = new Date();
        await pool.query(
            "INSERT INTO history (entity_id, entity_type, event_type, event_timestamp, description) VALUES ($1, $2, $3, $4, $5)",
            [entityId, entityType, eventType, eventTimestamp, description]
        );
    } catch (error) {
        console.error("logEvent error: ", error);
        throw error;
    }
}

module.exports = {
    logEvent,
};
