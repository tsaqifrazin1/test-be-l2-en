export const getArrayAsChunks = (array, chunkSize) => {
    const result = [];
    const data = array.slice(0);

    while (data[0]) {
        result.push(data.splice(0, chunkSize));
    }
    
    return result;
};