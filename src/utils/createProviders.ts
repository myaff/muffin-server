import { DataSource, EntityTarget, ObjectLiteral } from "typeorm";
import { DATA_SOURCE } from "src/utils/constants";

export function createProvider(repository: string, entity: EntityTarget<ObjectLiteral>) {
  return {
    provide: repository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(entity),
    inject: [DATA_SOURCE],
  }
}