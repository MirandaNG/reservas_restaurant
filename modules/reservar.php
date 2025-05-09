<?php  
  include '../includes/header.php';
?>

<div class="reservar-container">
  <div class="reservar-texto">
    <h2 class="Subtitulo">Reservar</h2>
    <p>Seleccione su mesa de acuerdo al número de personas</p>
  </div>
  <div class="mesa-options">
    <div class="mesa">
      <img src="../assets/img/Mesa2.png" alt="Mesa para 2 personas" onclick="seleccionarMesa(0)">
      <span>2 personas</span>
    </div>
    <div class="mesa">
      <img src="../assets/img/Mesa4.png" alt="Mesa para 4 personas" onclick="seleccionarMesa(1)">
      <span>4 personas</span>
    </div>
    <div class="mesa">
      <img src="../assets/img/Mesa6.png" alt="Mesa para 6 personas" onclick="seleccionarMesa(2)">
      <span>6 personas</span>
    </div>
    <div class="mesa">
      <img src="../assets/img/Mesa8.png" alt="Mesa para 8 personas" onclick="seleccionarMesa(3)">
      <span>8 personas</span>
    </div>
  </div>
</div>

<?php
    include '../includes/footer.php';
?>