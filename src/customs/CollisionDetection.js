export { predictCollision, detectCollision, detectContact };

function predictCollision({ p5, pChar, entities, displaceX, displaceY }) {
  let willCollide = false;
  for (let i in entities) {
    const entity = entities[i];
    const pCharVertices = pChar.getVerticesPpu(displaceX || 0, displaceY || 0);
    if (entity.shape.alias === "rect") {
      willCollide = p5.collideRectPoly(
        entity.x,
        entity.y,
        entity.width,
        entity.height,
        [
          p5.createVector(pCharVertices[0], pCharVertices[1]),
          p5.createVector(pCharVertices[2], pCharVertices[3]),
          p5.createVector(pCharVertices[4], pCharVertices[5]),
          p5.createVector(pCharVertices[6], pCharVertices[7]),
        ]
      );

      if (willCollide) {
        break;
      }
    }
  }
  return willCollide;
}

function detectCollision({ p5, pChar, entities, displaceX, displaceY }) {
  // displaceX, displaceY are optional
  // displaceX: displacement of center in x direction
  // displaceY: displacement of center in y direction
  
  const result = { die: false, collisions: [] };
  const pCharVertices = pChar.getVerticesPpu(displaceX || 0, displaceY || 0);
  for (let i in entities) {
    let collided = false;
    const entity = entities[i];
    if (entity.shape.alias === "rect") {
      collided = p5.collideRectPoly(
        entity.x,
        entity.y,
        entity.width,
        entity.height,
        [
          p5.createVector(pCharVertices[0], pCharVertices[1]),
          p5.createVector(pCharVertices[2], pCharVertices[3]),
          p5.createVector(pCharVertices[4], pCharVertices[5]),
          p5.createVector(pCharVertices[6], pCharVertices[7]),
        ]
      );
    } else if (entity.shape.alias === "tri") {
      collided = p5.collidePolyPoly(
        [
          p5.createVector(pCharVertices[0], pCharVertices[1]),
          p5.createVector(pCharVertices[2], pCharVertices[3]),
          p5.createVector(pCharVertices[4], pCharVertices[5]),
          p5.createVector(pCharVertices[6], pCharVertices[7]),
        ],
        [
          p5.createVector(entity.x1, entity.y1),
          p5.createVector(entity.x2, entity.y2),
          p5.createVector(entity.x3, entity.y3),
        ],
        true
      );
    }

    if (collided) {
      if (entity.type === "die") {
        result.die = true;
      }
      result.collisions.push({ entity });
    }
  }
  return result;
}

function detectContact({ p5, pChar, entities, contactThreshold }) {
  const contactResult = { contacts: [] };

  const displaceList = [
    [contactThreshold, contactThreshold],
    [-contactThreshold, contactThreshold],
    [-contactThreshold, -contactThreshold],
    [-contactThreshold, -contactThreshold],
  ];

  for (let i in displaceList) {
    const result = detectCollision({
      p5,
      pChar,
      entities,
      displaceX: displaceList[i][0],
      displaceY: displaceList[i][1],
    });
    if (result.collisions.length)
      contactResult.contacts.push(...result.collisions);
  }

  return contactResult;
}
