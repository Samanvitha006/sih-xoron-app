import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'patients',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'age', type: 'number' },
        { name: 'baseline_moca', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'family_media',
      columns: [
        { name: 'patient_id', type: 'string', isIndexed: true },
        { name: 'file_uri', type: 'string' },
        { name: 'relation_tag', type: 'string' },
        { name: 'voice_clone_uri', type: 'string', isOptional: true }
      ]
    }),
    tableSchema({
      name: 'schedules',
      columns: [
        { name: 'patient_id', type: 'string', isIndexed: true },
        { name: 'scheduled_time', type: 'string' },
        { name: 'task_type', type: 'string' },
        { name: 'is_completed', type: 'boolean' }
      ]
    }),
    tableSchema({
      name: 'game_telemetry',
      columns: [
        { name: 'patient_id', type: 'string', isIndexed: true },
        { name: 'game_id', type: 'string' },
        { name: 'accuracy_score', type: 'number' },
        { name: 'reaction_time_ms', type: 'number' },
        { name: 'stroke_jitter', type: 'number' },
        { name: 'saccade_velocity', type: 'number' },
        { name: 'synced_to_cloud', type: 'boolean' } // Sync Queue Flag
      ]
    }),
    tableSchema({
      name: 'qdrs_surveys',
      columns: [
        { name: 'patient_id', type: 'string', isIndexed: true },
        { name: 'date', type: 'number' },
        { name: 'score', type: 'number' },
        { name: 'synced_to_cloud', type: 'boolean' }
      ]
    })
  ]
})
