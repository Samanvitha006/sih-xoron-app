import { Model } from '@nozbe/watermelondb'
import { field, date, readonly, children } from '@nozbe/watermelondb/decorators'

export class Patient extends Model {
  static table = 'patients'
  static associations = {
    family_media: { type: 'has_many', foreignKey: 'patient_id' },
    schedules: { type: 'has_many', foreignKey: 'patient_id' },
    game_telemetry: { type: 'has_many', foreignKey: 'patient_id' },
    qdrs_surveys: { type: 'has_many', foreignKey: 'patient_id' },
  }

  @field('name') name
  @field('age') age
  @field('baseline_moca') baselineMoca

  @children('family_media') familyMedia
  @children('schedules') schedules
  @children('game_telemetry') gameTelemetry
  @children('qdrs_surveys') qdrsSurveys
}

export class FamilyMedia extends Model {
  static table = 'family_media'
  static associations = {
    patients: { type: 'belongs_to', key: 'patient_id' },
  }

  @field('patient_id') patientId
  @field('file_uri') fileUri
  @field('relation_tag') relationTag
  @field('voice_clone_uri') voiceCloneUri
}

export class Schedule extends Model {
  static table = 'schedules'
  static associations = {
    patients: { type: 'belongs_to', key: 'patient_id' },
  }

  @field('patient_id') patientId
  @field('scheduled_time') scheduledTime
  @field('task_type') taskType
  @field('is_completed') isCompleted
}

export class GameTelemetry extends Model {
  static table = 'game_telemetry'
  static associations = {
    patients: { type: 'belongs_to', key: 'patient_id' },
  }

  @field('patient_id') patientId
  @field('game_id') gameId
  @field('accuracy_score') accuracyScore
  @field('reaction_time_ms') reactionTimeMs
  @field('stroke_jitter') strokeJitter
  @field('saccade_velocity') saccadeVelocity
  @field('synced_to_cloud') syncedToCloud
}

export class QdrsSurvey extends Model {
  static table = 'qdrs_surveys'
  static associations = {
    patients: { type: 'belongs_to', key: 'patient_id' },
  }

  @field('patient_id') patientId
  @date('date') date
  @field('score') score
  @field('synced_to_cloud') syncedToCloud
}
