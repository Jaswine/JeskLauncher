const changeBackImage = document.querySelector('#changeBackImage');
const placeForImage = document.querySelector('.page__left__image');

const images = [
    'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/9130702/pexels-photo-9130702.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2835562/pexels-photo-2835562.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/847402/pexels-photo-847402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/4612304/pexels-photo-4612304.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/36744/agriculture-arable-clouds-countryside.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
]

// write the first image
placeForImage.src = images[localStorage.getItem('index') ?? 0];

// sorting images
changeBackImage.onclick = () => {
    let elementIndex = images.indexOf(placeForImage.src)
    let i = elementIndex + 1
    
    if (images.length > i) {
        placeForImage.src = images[i]
        localStorage.setItem('index', i)
    } else {
        placeForImage.src = images[0]
    }
}