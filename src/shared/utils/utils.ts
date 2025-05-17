

export const pagination = (size: number, offset?: number) => {
    if (!offset || offset <= 1) {
        offset = 0;
    } else {
        offset = (offset - 1) * size;
    }
    return {offset, size};
}