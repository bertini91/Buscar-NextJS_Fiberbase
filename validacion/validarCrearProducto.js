export default function validarCrearProducto(valores) {
  let errores = {};
  console.log(valores);

  //Validar el nombre del usuario
  if (!valores.nombre) {
    errores.nombre = "El nombre es obligatorio";
  }
  //Validar empresa
  if (!valores.empresa) {
    errores.empresa = "El nombre de la empresa es obligatorio!";
  }

  //Validar url
  if (!valores.url) {
    errores.url = "La URL del producto es oblogatoria";
  } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) {
    errores.url = "El formato de la URL no es válida";
  }

  //Validar descripcion
  if (!valores.descripcion) {
    errores.descripcion = "Agrega una descripcion del producto";
  }

  return errores;
}
