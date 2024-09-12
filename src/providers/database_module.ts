import { SelectQueryBuilder } from 'typeorm';
import { VIRTUAL_COLUMN_KEY } from '../decorators/virtual-column.decorators';

declare module 'typeorm' {
  interface SelectQueryBuilder<Entity> {
    getMany(this: SelectQueryBuilder<Entity>): Promise<Entity[] | undefined>;
    getOne(this: SelectQueryBuilder<Entity>): Promise<Entity | undefined>;
  }
}

SelectQueryBuilder.prototype.getMany = async function () {
  const { entities, raw } = await this.getRawAndEntities();
  if (!entities) return undefined;
  const items = entities.map((entitiy, index) => {
    const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, entitiy) ?? {};
    const item = raw[index];
    let key = Object.keys(metaInfo).find((key) =>
      metaInfo[key]['name'].includes('array'),
    );
    if (key) {
      key = metaInfo[key]['idColumn'];
    }

    const currentRaw = raw.filter((r) => r[key] === entitiy.id);

    for (const [propertyKey, name] of Object.entries<string>(metaInfo)) {
      const isNameArray = name['name'].includes('array');
      const itemExists = item[name['name']] !== undefined;

      if (isNameArray && itemExists) {
        const rawsEntity = raw.filter(
          (r) => r[name['idColumn']] === entitiy.id,
        );

        if (rawsEntity.length) {
          entitiy[propertyKey] = rawsEntity.map(
            (rawEntity) => rawEntity[name['name']],
          );
        } else {
          entitiy[propertyKey] = [];
        }

        const uniqueIds = [
          ...new Set(entitiy[propertyKey].map((obj) => obj.id)),
        ];
        entitiy[propertyKey] = uniqueIds.map((id) =>
          entitiy[propertyKey].find((obj) => obj.id === id),
        );
      } else {
        entitiy[propertyKey] = currentRaw.length
          ? currentRaw[0][name['name']]
          : item[name['name']];
      }
    }

    return entitiy;
  });

  return [...items];
};

SelectQueryBuilder.prototype.getOne = async function () {
  const { entities, raw } = await this.getRawAndEntities();
  if (!entities[0]) return undefined;
  const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, entities[0]) ?? {};

  for (const [propertyKey, name] of Object.entries<string>(metaInfo)) {
    const isNameArray = name['name'].includes('array');
    const rawExists = raw[0][name['name']] !== undefined;

    if (isNameArray && rawExists) {
      const rawsEntity = raw.filter(
        (r) => r[name['idColumn']] === entities[0].id,
      );

      if (rawsEntity.length) {
        entities[0][propertyKey] = rawsEntity.map(
          (rawEntity) => rawEntity[name['name']],
        );
        if (entities[0][propertyKey].length === 0) {
          entities[0][propertyKey] = null;
        }
        const uniqueIds = [
          ...new Set(entities[0][propertyKey].map((obj) => obj.id)),
        ];
        entities[0][propertyKey] = uniqueIds.map((id) =>
          entities[0][propertyKey].find((obj) => obj.id === id),
        );
      }
    } else {
      entities[0][propertyKey] = raw[0][name['name']];
    }
  }

  return entities[0];
};
