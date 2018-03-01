export const flattenGeo = (loc) => {

    if (loc)
        return `${loc.address ? loc.address + ', ' : ''}${loc.city ? loc.city + ', ' : ''}${loc.state ? loc.state + ', ' : ''}${loc.postalCode ? loc.postalCode + ', ' : ''}${loc.country ? loc.country : ''}`
    else
        return loc;
}