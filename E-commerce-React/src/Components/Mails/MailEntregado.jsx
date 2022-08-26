import React from 'react'
import emailjs from '@emailjs/browser'

function MailEntregado(props) {
    let templateParams={
        nombre:props.nombre,
        email:props.email,
        pedidoId:props.pedidoId,
        direccion:props.direccion,
        ciudad:props.ciudad,
        provincia:props.provincia
    }
    console.log(templateParams)

    let serviceId = "service_dg758cg"
    let templateId = "template_ist69pb"
    let publicId= "E-vdb5C3uANmhaNFl"
    emailjs.send(serviceId, templateId, templateParams, publicId)
    .then(function(response){
        
        console.log("Success", response.status, response.text)
    }, function(error){
        console.log("Failed", error)
        
    })

  return (
    <div>
       {MailEntregado}
       <h5>Mail Entregado</h5>
    </div>
  )
}

export default MailEntregado