export class user{
    id_personal
    clave
    tipo_personal
    nombre
    apellido1
    apellido2
    fecha_nacimiento
    
    user(){}
    user(id_personal, clave, tipo_personal, nombre, apellido1, apellido2, fecha_nacimiento)
    {
        this.id_personal= id_personal
        this.clave= clave
        this.tipo_personal= tipo_personal
        this.nombre= nombre
        this.apellido1= apellido1
        this.apellido2= apellido2
        this.fecha_nacimiento= fecha_nacimiento
        console.log('se creo un nuevo user')
    }



    personalData(){
        const personal={
            id: this.id_personal,
            clave: this.clave,
            tipo: this.tipo_personal,
            nombre: this.nombre,
            apellidos: this.apellido1 + this.apellido2,
            fecha_nacimiento: this.fecha_nacimiento

        }
        console.log('La informacion de este personal es: ')
        console.log(
            personal
        )
        return personal
    }

    
}
