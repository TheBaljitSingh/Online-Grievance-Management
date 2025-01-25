const generateGrievanceNumber = ()=>{

    const prefix = "GRV";
    const timestamp = Date.now().toString();

    return `${prefix}-${timestamp}`;

}

export default generateGrievanceNumber;

