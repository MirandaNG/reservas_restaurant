<?php  
  include '../includes/header.php';
?>

<div class="conocenos-container">
  <img src="../assets/img/platillo2.jpg" alt="Platillo italiano" class="col-sm-3 mb-3 img-derecha">
  <div class="text-container">
    <div class="conocenos-texto">
      <h2 class="Subtitulo">¡Conócenos!</h2>
      <p>En The ItalianRest, te invitamos a vivir una experiencia culinaria elegante y auténtica, inspirada en el corazón de Italia. Cada platillo celebra ingredientes frescos y recetas tradicionales en un ambiente sofisticado y acogedor, ideal para un momento especial.</p>
    </div>
    <div class="ubicanos-texto">
      <h3>Ubicación</h3>
      <p>Visítanos en Av. Reforma 123, Salamanca, todos los días de 1:00 p.m. a 10:00 p.m.</p>
    </div>
    <div id="map">
      <iframe id="map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4471.716732391987!2d-101.19591192413718!3d20.50732130548259!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842c8fa123acd9b3%3A0x46854e59b62b0cbf!2s%22UG%22%20-%20Divisi%C3%B3n%20de%20Ingenier%C3%ADas%20Campus%20Irapuato%20Salamanca%20DICIS!5e1!3m2!1ses-419!2smx!4v1746672474803!5m2!1ses-419!2smx" width="450" height="300" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  </div>
</div>

<div class="comentarios-container">
  <h2 class="Subtitulo">Comentarios</h2>
  <form id="comentario-form">
    <label for="nombre">Nombre:</label>
    <input type="text" id="nombre" name="nombre" required>

    <label for="comentario">Comentario:</label>
    <textarea id="comentario" name="comentario" required></textarea>

    <button type="submit">Enviar Comentario</button>
  </form>

  <div id="comentarios-lista">
    <!-- Comentarios cargados aparecerán aquí -->
  </div>
</div>

<?php
    include '../includes/footer.php';
?>