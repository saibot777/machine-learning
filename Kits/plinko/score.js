const outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel])
}

function distance(pointA, pointB) {
  return _.chain(pointA)
    .zip(pointB)
    .map(([a, b]) => (a - b) ** 2)
    .sum()
    .value() ** 0.5;
}

function runAnalysis() {
  const testSetSize = 100;
  const [testSet, trainingSet] = splitDataSet(outputs, testSetSize);

  _.range(1, 20).forEach(k => {
    const accuracy = _.chain(testSet)
    .filter(testPoint => knn(trainingSet, _.initial(testPoint), k) === testPoint[3])
    .size()
    .divide(testSetSize)
    .value();

    console.log('For a k of ', k ,' accuracy is ', accuracy)
  });

  
}

function knn(data, point, k) {
  return _.chain(data)
  .map(row => {
    return [
      distance(_.initial(row), _.initial(point)),
      _.last(row)
    ]
  })
  .sortBy(row => row[0])
  .slice(0, k)
  .countBy(row => row[1])
  .toPairs()
  .sortBy(row => row[1])
  .last()
  .first()
  .parseInt()
  .value();
}

function splitDataSet(data, testCount) {
  const shuffled = _.shuffle(data);

  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet]
}

