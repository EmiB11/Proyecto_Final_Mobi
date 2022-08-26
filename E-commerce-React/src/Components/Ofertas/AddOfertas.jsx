import React, { useEffect, useId, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getAllCategories, getCategories, postCategories } from '../../Actions/Category';
import { getAllOfertas } from '../../Actions/ofertas';
import SidebarAdmin from '../SidebarAdmin/SidebarAdmin'

const AddOfertas = () => {
    const [oferta, setOferta] = useState([])
    function validate(category) {
        let nameTest = /^[a-zA-ZA-y\s]{3,255}$/; //solo letras de 3 a 255 caracteres
        let errors = {};

        if (!category.nombre) {
            errors.nombre = "Se requiere un nombre de Categoría";
        } else if (!nameTest.test(category.nombre.trim())) {
            errors.nombre = "No se permiten números , solo letras de 3 a 80 caracteres";
        }
        return errors;
    }


    const dispatch = useDispatch();
    const history = useNavigate();

    const allOfertas = useSelector(
        (state) => state.ofertasReducer.allOfertas
    );
    
    const id = useId();
    useEffect(() => {
        dispatch(getAllOfertas());
    }, [dispatch]);

    const [errors, setErrors] = useState({});
    const [category, setcategory] = useState({
        nombre: "",
    });
    //console.log(category)
    const handleChange = (e) => {
        setcategory({
            ...category,
            nombre: e.target.value,
        });
        setErrors(
            validate({
                ...category,
                nombre: e.target.value,
            })
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!category.nombre) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Debe completar los campos faltantes",
                timer: 4000,
            });
            return;
        } else {
            //console.log(activity)
            dispatch(postCategories(category));
            Swal.fire({
                icon: "success",
                title: "Categoría creada",
                text: "La categoría se ha creado correctamente",
                timer: 4000,
            });
            setcategory({
                nombre: "",
            });
            history("/dashboard/admin");
        }
    };

    const handleOferta = (e) => {
        
        setOferta(allOfertas?.filter(elem => elem.titulo === e.target.value))
    }

    console.log("ofertas", oferta)

    return (
        <div className="container-fluid">
            <div className='row min-vh-100'>
                <div className="col-auto col-md-2 col-xl-2 px-0 ">
                    <SidebarAdmin />
                </div>
                <div className='col'>
                    <h4 className='h4'>Agregar oferta</h4>
                    <div className='row mb-4'>
                        <div className='col-4'>
                        <select  onChange={handleOferta} className="form-select" aria-label="">
                            <option defaultValue>Ver ofertas existentes</option>
                            {allOfertas?.map((el,id) => (
                                
                                <option  key={`category-${id}`} value={el.titulo}>
                                    {el.titulo}
                                </option>
                                
                                
                            ))}

                            
                        </select>
                        {
                                oferta && 
                                <>
                                    <div>
                                        <span><b>Descripcion:</b></span>
                                        <span>{oferta[0]?.descripcion}</span>
                                    </div>
                                    <div>
                                        <span><b>Descuento:</b></span>
                                        <span>{oferta[0]?.porcentajeDescuento}%</span>
                                    </div>
                                    <div>
                                        <span><b>Estado:</b></span>
                                        <span>{oferta[0]?.estado}</span>
                                    </div>
                                </>
                            }
                        </div>
                        
                    </div>
                    
                        <div className='row'>
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={category.nombre}
                                    onChange={handleChange}
                                    placeholder='Ingrese nombre de la categoria'
                                    className='col-4 mb-4'
                                />
                                {errors.nombre && <p className="text-danger">{errors.nombre}</p>}
                                <div className='col-2'>
                                    {errors.hasOwnProperty("nombre") ? (
                                        <p> Por favor complete los campos faltantes </p>
                                    ) : (
                                        <button className='btn btn-success' type="submit">
                                            Crear Categoría
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    
                    
                </div>
            </div>
        </div>
    )
}

export default AddOfertas