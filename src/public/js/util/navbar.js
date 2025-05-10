// Get only pathname
const pathName = window.location.pathname;
const currentPage = pathName.split('/')[pathName.split('/').length - 1];
console.log(currentPage);

try {
  const cardContainer = document.getElementById(`menu-${currentPage}`);
  cardContainer.classList.add('bg-gray-200');
} catch (error) {
  console.log('failed on js/util/navbar.js, error detail: ', error);
}
