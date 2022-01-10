const resport = '66df'
const portnum = Number(resport);
const port = portnum < 65536 || portnum > 0 ? portnum : NaN;

console.log(port ? port : 19132)