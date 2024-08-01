export interface Mapper<Do, Entity, DTO> {
  toDo(entity: Entity): Do
  toEntity(domain: Do): Entity
  toDTO(entity: Entity): DTO
}
