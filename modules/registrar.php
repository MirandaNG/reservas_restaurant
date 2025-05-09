<?php  
  include '../includes/header.php';
?>

<div class="container">
    <h1>Reservar</h1>
    <p>Registre los siguientes datos para comenzar</p>
    <div>
        <form>
            <label for="nombre">Nombre</label>
            <input type="text" id="nombre" name="nombre" required>
            <label for="correo">Correo</label>
            <input type="email" id="correo" name="correo" required>
            <label for="telefono">Telefono</label>
            <input type="tel" id="telefono" name="telefono" required>
            <label for="contrasena">Contraseña</label>
            <input type="password" id="contrasena" name="contrasena" required>
            <input type="button" value="Registrarse">
        </form>
    </div>
</div>

<?php
    include '../includes/footer.php';
?>