export const pagination = (size?: number, page?: number) => {
    if (size === undefined && page === undefined) {
        return { size: undefined, offset: undefined };
    }
    
    const finalSize = size !== undefined ? size : 10;
    
    let offset: number | undefined;
    
    if (page !== undefined) {
        offset = page < 1 ? 0 : (page) * finalSize;
    } else {
        offset = 0;
    }
    
    return { size: finalSize, offset };
}