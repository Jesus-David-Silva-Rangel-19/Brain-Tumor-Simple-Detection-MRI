const dropZone = document.getElementById("dropZone");
const imageUpload = document.getElementById("imageUpload");
const predictButton = document.getElementById("predictButton");
const result = document.getElementById("result");
const imagePreview = document.getElementById("imagePreview");

// Eventos para manejar la carga y arrastre de imagen
dropZone.addEventListener("click", () => imageUpload.click());
dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("bg-light");
});
dropZone.addEventListener("dragleave", () => dropZone.classList.remove("bg-light"));
dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("bg-light");
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
});

imageUpload.addEventListener("change", () => {
    const file = imageUpload.files[0];
    handleFileUpload(file);
});

function handleFileUpload(file) {
    if (file) {
        // Mostrar imagen de vista previa y SweetAlert de éxito
        imagePreview.src = URL.createObjectURL(file);
        imagePreview.classList.remove("d-none");
        Swal.fire({
            icon: 'success',
            title: 'Imagen cargada correctamente',
            text: 'Haz clic en el botón "Detectar Tumor" para analizar la imagen.',
            showConfirmButton: false,
            timer: 2000
        });
    }
}

predictButton.addEventListener("click", async () => {
    if (!imageUpload.files.length) {
        Swal.fire({
            icon: 'error',
            title: 'No se ha cargado ninguna imagen',
            text: 'Por favor, sube una imagen antes de predecir.',
        });
        return;
    }

    const formData = new FormData();
    formData.append("file", imageUpload.files[0]);

    // Llamada al backend para la predicción
    const response = await fetch("/predict", {
        method: "POST",
        body: formData,
    });
    const resultData = await response.json();
    
    // Mostrar el resultado de la predicción
    Swal.fire({
        icon: resultData.prediction === 'Tumor detectado' ? 'warning' : 'info',
        title: 'Resultado de la Predicción',
        text: resultData.prediction,
    });
});