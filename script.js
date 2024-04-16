document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('imageUpload');
    const uploadedImagesContainer = document.getElementById('uploadedImages');

    let uploadedImages = [];
    let uploadedImageHashes = new Set(); // Armazenará os hashes das imagens carregadas
    let lastSelectedImage = null;

    imageUpload.addEventListener('change', function(event) {
        Array.from(event.target.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const hash = getHashFromString(e.target.result);
                if (uploadedImageHashes.has(hash)) {
                    console.log('Imagem duplicada bloqueada'); // Notifica no console a prevenção de duplicata
                    return; // Evita adicionar a imagem duplicada ao DOM
                }

                // Adiciona o hash da nova imagem ao conjunto para controle
                uploadedImageHashes.add(hash);

                // Cria e adiciona a nova imagem ao contêiner
                const imgElement = document.createElement('img');
                imgElement.src = e.target.result;
                imgElement.addEventListener('click', function() {
                    selectImage(imgElement);
                });
                uploadedImagesContainer.appendChild(imgElement);
                uploadedImages.push(imgElement);
            };
            reader.readAsDataURL(file);
        });
    });

    function selectImage(imgElement) {
        if (lastSelectedImage && lastSelectedImage !== imgElement) {
            swapImages(imgElement, lastSelectedImage);
            lastSelectedImage.classList.remove('selected');
            lastSelectedImage = null;
        } else if (!imgElement.classList.contains('selected')) {
            imgElement.classList.add('selected');
            lastSelectedImage = imgElement;
        } else {
            imgElement.classList.remove('selected');
            lastSelectedImage = null;
        }
    }

    function swapImages(img1, img2) {
        const index1 = uploadedImages.indexOf(img1);
        const index2 = uploadedImages.indexOf(img2);
        [uploadedImages[index1], uploadedImages[index2]] = [uploadedImages[index2], uploadedImages[index1]];
        uploadedImagesContainer.insertBefore(img2, img1);
        uploadedImagesContainer.insertBefore(img1, uploadedImages[index2 + 1] || null);
    }

    // Função para gerar um hash simples a partir de uma string
    function getHashFromString(string) {
        let hash = 0, i, chr;
        for (i = 0; i < string.length; i++) {
            chr   = string.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Converte para hash de 32bit inteiro
        }
        return hash;
    }
});