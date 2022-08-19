const BASE_API = 'http://132.255.70.43/censo_v11/public/api/';
//const BASE_API = 'http://192.168.0.8:8000/api/';

class Api {
  returnDeError = (error) => {
    if (error.message === 'Network request failed') {
      return null;
    } else {
      console.log('error', error);
    }
  };

  async login(user) {
    const response = await fetch(`${BASE_API}login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: user.nombre,
        password: user.contraseña,
        id_ciudad: user.idCiudad,
      }),
    });
    const responseJson = await response.json();
    return responseJson;
  }

  async me(token) {
    const response = await fetch(`${BASE_API}me`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      //body: JSON.stringify (token),
    });
    const responseJson = await response.json();
    return responseJson;
  }

  async getUser(id) {
    try {
      const response = await fetch(`${BASE_API}user/${id}`);
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return this.returnDeError(error)
    }
  }

  async getCiudades() {
    const response = await fetch(`${BASE_API}ciudad`);
    const responseJson = await response.json();
    return responseJson;
  }

  async getCiudad(id) {
    const response = await fetch(`${BASE_API}ciudad/${id}`);
    const responseJson = await response.json();
    return responseJson;
  }

  async getVisitas(idUser) {
    try {
      const response = await fetch(`${BASE_API}visita/${idUser}`);
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return this.returnDeError(error)
    }
  }

  async getInmuebles(idVisita) {
    try {
      const response = await fetch(`${BASE_API}inmueble/list/${idVisita}`);
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return this.returnDeError(error)
    }
  }

  async getInmueble(id) {
    try {
      const response = await fetch(`${BASE_API}inmueble/${id}`);
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return this.returnDeError(error)
    }
  }

  async getPropietario(idInmueble) {
    try {
      const response = await fetch(`${BASE_API}propietario/${idInmueble}`);
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return this.returnDeError(error)
    }
  }

  async getEdificacion(idInmueble) {
    try {
      const response = await fetch(`${BASE_API}edificacion/${idInmueble}`);
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return this.returnDeError(error)
    }
  }

  async getEdificacionMaterial(idEdificacion) {
    try {
      const response = await fetch(`${BASE_API}edificacMater/${idEdificacion}`);
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return this.returnDeError(error)
    }
  }

  async editarInmueble(inmueble, id) {
    try {
      const response = await fetch(`${BASE_API}inmueble/${id}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inmueble),
      });
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return this.returnDeError(error)
    }
  }

  async cambiarEstado(id) {
    try {
      const response = await fetch(`${BASE_API}inmueble/cambiarEstado/${id}`);
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return this.returnDeError(error)
    }
  }

  async guardarFotos(fotos) {
    try {
      const response = await fetch(`${BASE_API}imagen`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fotos),
      });
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error('error', error);
    }
  }

  async getFotos(idInmueble) {
    try {
      const response = await fetch(`${BASE_API}imagen/${idInmueble}`);
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.log('error', error);
    }
  }

  async eliminarFotos(idInmueble) {
    try {
      const response = await fetch(`${BASE_API}imagendelete/${idInmueble}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(idInmueble),
      });
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error('error', error);
    }
  }

  //MODULO ACTIVIDAD ECONOMICA

  async getActividadesP() {
    const response = await fetch(`${BASE_API}actividadp`);
    const responseJson = await response.json();
    return responseJson;
  }

  async getCondicionesP() {
    const response = await fetch(`${BASE_API}condicionp`);
    const responseJson = await response.json();
    return responseJson;
  }

  async getVisitasP(idUser) {
    try {
      const response = await fetch(`${BASE_API}visitap/${idUser}`);
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return this.returnDeError(error)
    }
  }

  async getPatentes(idVisita) {
    try {
      const response = await fetch(`${BASE_API}patente/list/${idVisita}`);
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return this.returnDeError(error)
    }
  }

  async getPatente(id) {
    try {
      const response = await fetch(`${BASE_API}patente/${id}`);
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return this.returnDeError(error)
    }
  }

  async guardarPatente(patente) {
    try {
      const response = await fetch(`${BASE_API}patente`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patente),
      });
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return this.returnDeError(error)
    }
  }

  async editarPatente(patente, id) {
    try {
      const response = await fetch(`${BASE_API}patente/${id}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patente),
      });
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return this.returnDeError(error)
    }
  }

  async cambiarEstadoP(id) {
    try {
      const response = await fetch(`${BASE_API}patente/cambiarEstado/${id}`);
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return this.returnDeError(error)
    }
  }

  async guardarVisitaP(visita) {
    try {
      const response = await fetch(`${BASE_API}visitap`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visita),
      });
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return this.returnDeError(error)
    }
  }

  async getFotosP(idPatente) {
    try {
      const response = await fetch(`${BASE_API}imagenp/${idPatente}`);
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.log('error', error);
    }
  }

  async guardarFotosP(fotos) {
    try {
      const response = await fetch(`${BASE_API}imagenp`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fotos),
      });
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error('error', error);
    }
  }

  async eliminarFotosP(idPatente) {
    try {
      const response = await fetch(`${BASE_API}imagenp/${idPatente}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(idPatente),
      });
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error('error', error);
    }
  }

  async getPropietarioP(idPatente) {
    try {
      const response = await fetch(`${BASE_API}propietariop/${idPatente}`);
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return this.returnDeError(error)
    }
  }

  async getResultadoP(idPatente) {
    try {
      const response = await fetch(`${BASE_API}resultadop/${idPatente}`);
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      return this.returnDeError(error)
    }
  }
}

export default new Api();
