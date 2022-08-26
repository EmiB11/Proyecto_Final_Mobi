import { validateTlf } from '../../Helpers/ValidateForm'

export function validation(input){
    let errors ={};

    if(!input.title.trim()){
        errors.title ="ingrese el nombre por favor"
    }
    if(input.price === ""){
        errors.price ="ingrese el precio por favor"
    }else if(input.price < 0){
        errors.price ="el valor no puede ser negativo"
    }
    if(!input.description.trim()){
        errors.description ="ingrese la descripción por favor"
    }
    if(!input.images){
        errors.images ="ingrese imagen/es por favor"
    }
    if(input.cantidad === ""){
        errors.cantidad ="ingrese el stock por favor"
    }else if(input.cantidad < 0){
        errors.price ="el stock no puede ser negativo"
    }
    if(input.categoriaId === ""){
        errors.categoriaId ="seleccione categoría por favor"
    }
    if(input.height === "" ){
        errors.height ="ingrese altura por favor"
    }
    return errors;

    
}