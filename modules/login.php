<?php  
  include '../includes/header.php';
?>

<div class="container">
    <div class="row justify-content-center mt-5">
        <div class="col-md-4">
            <h1>Reservar</h1>
            <p>¡Bienvenido! Inicie sesion para comenzar</p>
            <div>
                <form>
                    <label for="usuario">Usuario</label>
                    <input type="text" id="usuario" name="usuario" required>
                    <label for="contrasena">Contraseña</label>
                    <input type="password" id="contrasena" name="contrasena" required>
                    <input type="button" value="Registrarse" onclick="location.href='registrar.html'">
                    <input type="button" value="Ingresar">
                </form>
            </div>
        </div>
    </div>
</div>

<?php
    include '../includes/footer.php';
?>