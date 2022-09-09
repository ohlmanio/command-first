// v1 stores all objects in their entirety

// v2 is more efficient
// 1KB and smaller items are always stored in their entirety
// >1KB are stored as key/value stream:
// {} keys & values
// [] array
// +[] append array
// @1[] insert array at index
// x=hash
// delete x,y,z
// delete 0-9
