export const cardNameValidation = (value: string): [boolean, string] => {
    if(value.length === 0)
        return [false, 'Card name can\'t be empty'];
    
    if(value.length > 200)
        return [false, 'Card name is too long'];

    return [true, ''];
};

export const columnNameValidation = (value: string): [boolean, string] => {
    if(value.length === 0)
        return [false, 'Column name can\'t be empty'];
    
    if(value.length > 70)
        return [false, 'Column name is too long'];

    return [true, ''];
}