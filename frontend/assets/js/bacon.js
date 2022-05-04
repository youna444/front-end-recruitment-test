const baconWrapper = document.querySelector('.bacon');
const baconButton = baconWrapper.querySelector('button');
const baconImage = baconWrapper.querySelector('img');
const baconImageParent = baconImage.parentElement;

window.addEventListener('DOMContentLoaded', () => {
    setBaconImageParentStyles(); //prevent cloned elements overflowing button
});

baconButton.addEventListener('click', (e) => {
    const clonedBaconImage = baconImage.cloneNode(true); //clone bacon image element
    setBaconImageStyles(clonedBaconImage); //keep image responsive
    baconImageParent.appendChild(clonedBaconImage); //append clone to the image parent
});

const setBaconImageParentStyles = () => {
    baconImageParent.style.height = baconImage.height+'px';
};

const setBaconImageStyles = (element) => {
    element.style.maxWidth = 'auto';
    element.style.height = 'auto';
};



