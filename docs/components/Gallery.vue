<template>
    <div class="gallery-container">
        <div class="gallery-grid">
            <div v-for="(image, index) in images" :key="index" class="gallery-card">
                <img :src="image.src" class="gallery-image" />
                <p v-if="image.text" class="gallery-text">{{ image.text }}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Gallery',
    props: {
        images: {
            type: Array,
            required: true,
            default: () => []
        }
    }
}
</script>

<style scoped>


.gallery-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    padding-bottom: 20px;
}


@media (min-width: 500px) {
    .gallery-grid {
        grid-template-columns: repeat(2, minmax(250px, 1fr));
        gap: 25px;
        padding-bottom: 25px;
    }
}

.gallery-card {
    border-radius: 12px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08),
        0 2px 2px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.gallery-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12),
        0 4px 4px rgba(0, 0, 0, 0.06);
}

.gallery-image {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 12px 12px 0 0;
    transition: opacity 0.3s ease;
}

.gallery-image:hover {
    opacity: 0.95;
}


.gallery-text {
    padding: 15px 20px;
    text-align: center;
    font-size: 1rem;
    color: #333;
    font-weight: 500;
    line-height: 1.4;
}
</style>