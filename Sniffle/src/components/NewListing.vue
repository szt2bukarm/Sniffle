 <script setup>
import { hideLoader, showLoader } from '@/utils/helper';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import BreedInformation from './BreedInformation.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import ListingPage from '@/pages/ListingPage.vue';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-icon-2x.png';
import L from 'leaflet';

import { OpenStreetMapProvider } from 'leaflet-geosearch';
import ListingDetails from './ListingDetails.vue';
const provider = new OpenStreetMapProvider();

const map = ref(null)

let leafletMap;

const currentSlide = ref(0)

const breeds = ref([])
const filteredBreeds = ref([])
const showInfo = ref(false)
const tags = ref(['Cute','Playful','Energetic','Friendly','Intelligent','Patient','Alert','Confident','Brave','Guarding','Sensitive','Barking','Sociable','Adorable'])
const selectedTags = ref([])

// inputs
const allowNext = ref(false)
const name = ref('')
const femaleSelected = ref(false);
const maleSelected = ref(false);
const unsureChecked = ref(false)
const birthday = ref('')
const description = ref('')
const selectedBreed = ref('');
const breedName = ref('')
const images = ref([])
const imagePreviews = ref([]);
const mapQueryResults = ref([]);
const successfullyPublished = ref(false)

// next button checker
const nextButtonChecker = function() {
    if (currentSlide.value == 0 && name.value.trim() != '' && (femaleSelected.value != false || maleSelected.value != false)) {
        allowNext.value = true
    } else if (currentSlide.value == 1 && description.value.trim() != '' && (unsureChecked.value || birthday.value != '')) {
        allowNext.value = true
    } else if (currentSlide.value == 2 && selectedBreed.value != '') {
        allowNext.value = true
    } else if (currentSlide.value == 3 && selectedTags.value.length > 0) {
        allowNext.value = true
        console.log(allowNext.value);
    } else if (currentSlide.value == 4 && images.value.length > 0) {
        allowNext.value = true
    } else if (currentSlide.value == 5) {
        allowNext.value = true
    } else {
        allowNext.value = false
    }
}


// block scrolling
onMounted(() => {
    window.scrollTo(200,200)
    window.addEventListener('scroll',blockScrolling)
    window.addEventListener('resize',blockScrolling)
})
onBeforeUnmount(() => {
    window.removeEventListener('scroll',blockScrolling)
    window.removeEventListener('resize',blockScrolling)
})
const blockScrolling = () => {
    scrollY > 50 ? window.scrollTo(200,200) : window.scrollTo(200,200)
}

// get breeds
const getBreeds = async () => {
    showLoader()
    const resp = await fetch(`http://localhost:3000/api/breed/names`, {
        method: 'GET',
    })
    const data = await resp.json()
    breeds.value = data
    // console.log(breeds.value);
    hideLoader()
}

// get breeds when slide is correct
const dataFetched = ref(false)
watch(currentSlide, async () => {
    if(currentSlide.value == 2 && !dataFetched.value) {
        dataFetched.value = true
        await getBreeds()
        filteredBreeds.value = breeds.value.data.doc
    }
})

// manage tags

const manageTag = function(tag){
    if (selectedTags.value.includes(tag)) {
        selectedTags.value = selectedTags.value.filter((t) => t != tag)
        nextButtonChecker()
        return
    }
    if (selectedTags.value.length == 4) return;

    selectedTags.value.push(tag)
    nextButtonChecker()
}


// configure map

const locationY = ref(0);
const locationX = ref(0);
const approxLocationX = ref(0);
const approxLocationY = ref(0);
const address = ref('');
const shortAddress = ref('');
const getMapCenter =  async function() {
    let center = leafletMap.getCenter();
    locationX.value = center.lat;
    locationY.value = center.lng;
    const addressData = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${center.lat}&lon=${center.lng}&format=json`);
    const data = await addressData.json();
    if(!data) {
        allowNext.value = false;
        return;
    }
    console.log(data);
    address.value = data.display_name
    shortAddress.value = `${data.address.city ? data.address.city : data.address.town ? data.address.town : data.address.village ? data.address.village : data.address.state}, ${data.address.country}`

    
    const location = await provider.search({
        query: data.address.city ? data.address.city : data.address.town ? data.address.town : data.address.village ? data.address.village : data.address.state + ' ' + data.address.country
    });
    if(location) {
        console.log(location[0]);
        approxLocationX.value = location[0].x;
        approxLocationY.value = location[0].y;
    }

    allowNext.value = true;
}

const mapInitialized = ref(false)
watch(currentSlide, async () => {
    if(currentSlide.value == 5 && !mapInitialized.value) {
        mapInitialized.value = true
        leafletMap = L.map(map.value).setView([41,40],100)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    }).addTo(leafletMap);

    leafletMap.on('movestart', () => {
        allowNext.value = false;
    })
    leafletMap.on('moveend', getMapCenter);

    if (navigator.geolocation) {
        showLoader()
            navigator.geolocation.getCurrentPosition(position => {
            leafletMap.setView([position.coords.latitude, position.coords.longitude], 50);
            hideLoader()
        }, error => {
            hideLoader();
        })
    } else {
        hideLoader()
    }
    }
})


// breed search
const searchBreed = function(query) {
    filteredBreeds.value = Object.values(breeds.value.data.doc).filter(breed => (breed.name).toLowerCase().includes(query))
}


// image upload
const handleImages = function(e) {
    const files = e.target.files
    if (files.length == 0 || files.length > 5 || images.value.length == 5) return
    [...files].forEach(file => {
        const imageURL = URL.createObjectURL(file)
        images.value.push({file, url: imageURL})
        imagePreviews.value.push(imageURL)
    })
}

// map search
const mapSearchFocused = ref(false);
const mapSearch = async function(query) {
    mapQueryResults.value = await provider.search({
        query: query,
    })
}

let debounceTimer;
const delayedMapSearch = function(query, delay) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        mapSearch(query);
    }, delay);
};

const setMapView = async function(lat,lng) {
    leafletMap.setView([lat,lng], 25);
    await getMapCenter()
}


// publish listing
const publishListing = async function() {
    showLoader()
    const form = new FormData();
    form.append('name', name.value)
    form.append('gender', maleSelected.value ? 'male' : 'female')
    form.append('description', description.value)
    form.append('breed', selectedBreed.value)
    birthday.value ? form.append('birthday', birthday.value) : null
    form.append('approximateLocation[country]', shortAddress.value.split(', ')[1])
    form.append('approximateLocation[place]', shortAddress.value.split(', ')[0])
    selectedTags.value.forEach(tag => form.append('tags', tag))
    images.value.forEach(img => form.append('images', img.file))
    form.append('exactLocation[coordinates][0]', locationX.value)
    form.append('exactLocation[coordinates][1]', locationY.value)
    form.append('approximateLocation[coordinates][0]', approxLocationX.value)
    form.append('approximateLocation[coordinates][1]', approxLocationY.value)

    const resp = await fetch('http://localhost:3000/api/listings', {
        method: 'POST',
        body: form,
        credentials: 'include'
    })

    successfullyPublished.value = true
    hideLoader()
}

 </script>
 
 <template>
    <div class="new-listing">
        <div class="new-listing--inner-wrapper">
            <div class="new-listing--inner"  :style="{ transform: `translateX(-${currentSlide * 100}%)` }">


            
            <div class="new-listing-screen">
                <p class="new-listing--header">Let's put up your little friend for adoption!</p>
                <p class="new-listing--text">First, please tell us the name of your pet.</p>
                <div class="new-listing--inputs">
                    <div class="popup-item--input">
                        <label class="popup-item--input-label" for="fullname">Name</label>
                        <input @keyup="nextButtonChecker" :disabled="currentSlide != 0" type="text" class="popup-item--input-field" name="fullname" v-model="name" required>
                    </div>
                </div>
                <p class="new-listing--text">Now, please choose the gender of your pet.</p>
                <div class="new-listing--genders">
                    <div class="new-listing--genders-gender-wrapper" :class="{ 'gender-active': maleSelected}">
                        <ion-icon class="new-listing--genders-gender gender-male" @click="maleSelected = true; femaleSelected = false; nextButtonChecker()" name="male"></ion-icon>
                    </div>
                    <div class="new-listing--genders-gender-wrapper" :class="{ 'gender-active': femaleSelected}">
                        <ion-icon class="new-listing--genders-gender gender-female" @click="maleSelected = false; femaleSelected = true; nextButtonChecker()" name="female"></ion-icon>
                    </div>
                </div>
            </div>



            <div class="new-listing-screen">
                <p class="new-listing--header">Tell us a bit more.</p>
                <p class="new-listing--text">Okay, when was {{ name }} born?<br>(If you're unsure, just check the checkbox.) </p>
                <div class="new-listing--inputs">
                    <div class="popup-item--input">
                        <label class="popup-item--input-label" for="birthday">Date of birth</label>
                        <input :disabled="currentSlide != 1 || unsureChecked" type="date" class="popup-item--input-field" name="birthday" v-model="birthday" @change="nextButtonChecker" required>
                    </div>
                    <div style="display: flex; gap: 1rem;">
                        <input :disabled="currentSlide != 1" v-model="unsureChecked" @change="nextButtonChecker(); birthday = ''" class="birthday-checkbox" type="checkbox" name="unsureBirthday" id="unsureBirthday">
                        <label style="font-size: var(--small);" for="unsureBirthday">I am not sure.</label>
                    </div>
                </div>
                <p class="new-listing--text">Now, please write a few thoughts about {{ name }}.</p>
                <textarea v-model="description" @keyup="nextButtonChecker" :disabled="currentSlide != 1" class="new-listing--textarea" cols="40" rows="10"></textarea>
            </div>



            <div class="new-listing-screen">
                <p class="new-listing--header">Almost there...</p>
                <p class="new-listing--text">So, what breed is {{ name }}?</p>
                <input @keyup="searchBreed(searchQuery)" v-model="searchQuery" type="text" class="new-listing--search" placeholder="Search..." id="">
                <div class="new-listing--breedlist" v-if="breeds.data">
                    <p class="new-listing--breedlist-breed" v-for="breed in filteredBreeds" :class="{ 'breed-active': breed._id === selectedBreed }" @click="selectedBreed = breed._id; breedName = breed.name; nextButtonChecker()">{{ breed.name }}</p>
                </div>
                <button class="new-listing--breedlist-btn" :disabled="!selectedBreed" @click="showInfo = true">See breed information</button>
            </div>

            <div class="new-listing-screen">
                <p class="new-listing--header">Almost there...</p>
                <p class="new-listing--text">{{ name }}?</p>
                <div class="new-listing--tags">
                    <div class="new-listing--tag" :class="{ 'new-listing--tag-selected': selectedTags.includes(tag)}" @click="manageTag(tag)"  v-for="tag in tags">{{ tag }}</div>
                </div>
            </div>



            <div class="new-listing-screen">
                <p class="new-listing--header">Just little more.</p>
                <p class="new-listing--text">Show the world how cute {{ name }} is.</p>
                <div class="new-listing-imageuploader">
                    <div class="new-listing-imageuploader-action" v-if="images.length == 0">
                        <ion-icon class="new-listing-imageuploader-icon" name="images"></ion-icon>
                        <input ref="imageuploader" style="display: none;" type="file" accept=".jpg,.png,.jpeg" multiple name="image" id="image" @change="handleImages($event); nextButtonChecker()">
                        <button class="new-listing-imageuploader-input" @click="$refs.imageuploader.click()">Upload images</button>
                        <p class="new-listing-imageuploader-info">Upload up to 5 images</p>
                    </div>
                    <div class="new-listing-imagelist">
                        <div class="new-listing-imagelist-item" v-for="image in images">
                            <div class="new-listing-imagelist-image-wrapper">
                                <img :src="image.url" class="new-listing-imagelist-image">
                            </div>
                            <p class="new-listing-imagelist-title">{{ (image.file.name).slice(0,10)+'...' }}</p>
                            <ion-icon class="new-listing-imagelist-trash" name="trash" @click="images.splice(images.indexOf(image),1); imagePreviews.splice(imagePreviews.indexOf(image.url),1); nextButtonChecker()"></ion-icon>
                        </div>
                    </div>
                </div>
                <div v-if="images.length != 0">
                    <input ref="imageuploader" style="display: none;" type="file" accept=".jpg,.png,.jpeg" multiple name="image" id="image" @change="handleImages($event)">
                    <button class="new-listing-imageuploader-input" @click="$refs.imageuploader.click()">Upload images</button>
                    <p class="new-listing-imageuploader-info">Upload up to 5 images</p>
                </div>
            </div>



            <div class="new-listing-screen">
                <p class="new-listing--header">One last step.</p>
                <p class="new-listing--text">Where can the new owner find {{ name }}?<br>Your precise address will not be shown publicly.</p>
                <input @focusin="mapSearchFocused = true" @keyup="delayedMapSearch(mapQuery,300)" v-model="mapQuery" type="text" class="new-listing--search" placeholder="Search..." id="">
                <div class="listing-map-wrapper">
                    <div class="listing-map" ref="map"></div>
                    <FontAwesomeIcon :icon="faLocationDot" class="listing-map--pin" />
                    <div class="listing-map--results" v-if="mapQueryResults.length != 0 && mapSearchFocused">
                        <div class="listing-map--results-item" v-for="result in mapQueryResults">
                            <p @click="setMapView(result.y,result.x); mapSearchFocused = false" class="listing-map--results-item-label">{{ result.label }}</p>
                        </div>
                    </div>
                </div>
                <p class="listing-map--address"><span>Selected address:</span><br>{{ address }}</p>
            </div>




            <div class="new-listing-screen">
                <p class="new-listing--header">Almost done!</p>
                <p class="new-listing--text">Please verify your listing details.</p>
                <ListingDetails v-if="currentSlide === 6" class="new-listing--preview" :name="name" :gender="maleSelected ? 'male' : 'female'" :birthday="birthday" :description="description" :images="imagePreviews" :breed="breedName" :address="shortAddress" :lat="approxLocationX" :lng="approxLocationY" :tags="selectedTags"/>
            </div>

            <div class="new-listing-screen new-listing-screen--success" v-if="successfullyPublished">
                <ion-icon class="new-listing--success-icon" name="checkmark-circle"></ion-icon>
                <p class="new-listing--success-text">Your listing has been successfully submitted. We'll approve it shortly.</p>
                <button class="new-listing--success-btn" @click="emitter.emit('closeModal')">See my listings</button>
            </div>
        </div>
        </div>


        <div class="new-listing--buttons" v-if="currentSlide != 7">
            <button :disabled="currentSlide === 0" class="new-listing--btn" @click="currentSlide--; nextButtonChecker()">&lt; Prev step</button>
            <button v-if="currentSlide != 6" :disabled="!allowNext" class="new-listing--btn" @click="currentSlide++; nextButtonChecker()">Next step &gt;</button>
            <button v-if="currentSlide == 6" class="new-listing--btn new-listing--btn-publish" @click="currentSlide++; publishListing()">Publish &check;</button>
        </div>



        <transition name="tab" mode="out-in" @after-enter="$refs.breedInfo.style.transform = 'translateY(0)'">
            <div ref="breedInfo" class="new-listing-breedinfo" v-if="showInfo">
                <div class="new-listing-breedinfo-wrapper">
                    <ion-icon @click="showInfo = false" class="new-listing-breedinfo-close" name="close-outline"></ion-icon>
                    <BreedInformation :id="selectedBreed"/>
                </div>
            </div>
        </transition>
    </div>
 </template>
 
 <style lang='scss'>
.listing-map {
    width: 100%;
    height: 100%;
    z-index: 0;
  &-wrapper{
    position: relative;
    margin-block: 2rem;
    height: 30rem;
    width: 50rem;
    border-radius: 2rem;
    overflow: hidden;

    @media screen and (max-width: 600px) {
        width: 90%; 
    }
  }

  &--pin{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-70%);
    font-size: 4rem;
    color: #fff;
    filter: drop-shadow(0 0 5px #000);
    z-index: 0;
  }

  &--address{
    text-align: center;
    width: 50rem;
    font-size: var(--small);

    @media screen and (max-width: 600px) {
        width: 90%; 
    }

    & span{
        font-weight: 600;
        font-size: var(--paragraph);
    }
  }

  &--results {
    position: absolute;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    height: 80%;
    width: 80%;
    background-color: #fff;
    border-radius: 2rem;
    overflow-y: auto;

    &-item{
        font-size: var(--paragraph);
        padding: 1rem;
        cursor: pointer;
        transition: 100ms;
        &:hover{
            background-color: lighten($color: #000000, $amount: 95%);
        }
    }
  }
}


.tab-enter-active,
.tab-leave-active {
  transition: transform 400ms cubic-bezier(.65,.05,.36,1);
}

.tab-leave-to{
    transform: translateY(100%) !important;
}

.tab-enter-to{
    transform: translateY(0) !important;
}


.new-listing{
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 120vh;
    overflow: hidden;

    &--inner{
        margin-top: 15rem;
        display: flex;
        scale: 1;
        &-wrapper{
            width: 100%;
            height: 90vh;
            overflow: hidden;

            @media screen and (max-width: 600px) {
                width: 100%;
            }
        }
        transition: transform 200ms;
    }

    &-screen{
        min-width: 100%;
        height: 90vh;
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: 1rem;

        @media screen and (max-width: 600px) {
            min-width: 100%;
        }

        @media screen and (max-width: 400px) {
            scale: 0.8
        }

        &--success{
            display: flex;
            align-items: center;
            justify-content: center;
            height: 90vh;
        }
    }

    &--success{
        display: flex;
        align-items: center;
        justify-content: center;

        &-icon{
            font-size: 12rem;
            margin-bottom: 2rem;
            scale: 0;
            opacity: 0;
            animation: success 1.1s ease-in-out forwards, success_slide 200ms ease-in-out forwards .9s;
        }

        &-text{
            font-size: var(--heading5);
            width: 50rem;
            text-align: center;
            opacity: 0;
            transform: translateY(1rem);
            animation: success_slide 200ms ease-in-out forwards .95s;

            @media screen and (max-width: 600px) {
                width: 90%;
            }
        }

        &-btn{
            margin-top: 2rem;
            padding: 1rem;
            border: 0;
            border-radius: 1rem;
            background-color: #000;
            color: #fff;
            font-size: var(--heading6);
            // scale: 0;
            opacity: 0;
            transform: translateY(1rem);
            animation: success_slide 200ms ease-in-out forwards 1s;

            &:hover{
                color: #000;
                background-color: lighten($color: #000000, $amount: 95%);
            }
        }
    }

    @keyframes success {
        30% {
            scale: 1.5;
            opacity: 1;
        }
        50% {
            scale: 1;
            opacity: 1
        }
        100%{
            opacity: 1;
            scale: 1;
        }
    }
    @keyframes success_slide {
        to {
            opacity: 1;
            transform: translateY(-3rem);
        }
    }

    &--inputs{
        width: 45rem;
        padding: 2rem 5rem;
    }

    &--header{
        font-size: var(--heading4);
        font-family: Berlin;
        text-align: center;
        letter-spacing: -2px;
        margin-bottom: 1rem;
    }

    &--text{
        font-size: var(--heading6);
        text-align: center;
    }

    &--buttons{
        position: absolute;
        bottom: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2rem;
    }

    &--btn{
        padding: 2rem 3rem;
        font-size: var(--heading5);
        font-family: BerlinLight;
        letter-spacing: -1px;
        border-radius: 5rem;
        border: 0;
        box-shadow: 0 1rem 1.5rem rgba(0, 0, 0, 0.3);
        background-color: #000;
        color: #fff;
        width: 19rem;
        transition: 100ms;
        cursor: pointer;

        @media screen and (max-width: 600px) {
            width: 15rem;;
        }

        &:hover{
            transform: translateY(2px);
            box-shadow: 0 0.8rem 1rem rgba(0, 0, 0, 0.3);
        }

        @media screen and (max-width: 600px) {
            font-size: var(--paragraph);
        }


        &-publish{
            background-color: #fff;
            color: #000;
            border: 2px solid #000;
            box-shadow: 0 1rem 1.5rem rgba(0, 0, 0, 0.3);
            &:hover{
                background-color: #000;
                color: #fff;
                box-shadow: 0 0.8rem 1rem rgba(0, 0, 0, 0.3);
            }
        }
    }

    &--search{
            padding: .5rem 1rem;
            border-radius: 1rem;
            border: 0;
            background-color: lighten($color: #000000, $amount: 95%);
            margin-top: 1rem;
        }

    &--textarea{
        margin-top: 2rem;
        padding: 1rem;
        font-size: var(--paragraph);
        border: 0;
        border-radius: 1rem;
        background-color: lighten($color: #000, $amount: 95%);
        resize: none;
    }

    &--genders{
        margin-top: 2rem;
        display: flex;
        gap: 2rem;
        padding: 2rem;

        &-gender{
            padding: 3rem;
            font-size: 8rem;
            cursor: pointer;

            &-wrapper{
                box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
                border-radius: 2rem;
                transition: 100ms;

                &:hover{
                    transform: translateY(5px);
                    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
                }
            }
        }
    }

    &--tags{
        margin-top: 2rem;
        gap: 2rem;
        width: 32rem;
        height: 40rem;
        flex-wrap: wrap;
        background-color: lighten($color: #000000, $amount: 95%);
        padding: 2rem;
        border-radius: 2rem
    }
    
    &--tag{
        display: inline-block;
        margin: .5rem;
        padding: .5rem 1rem;
        font-size: var(--paragraph);
        border-radius: 1rem;
        background-color: lighten($color: #000, $amount: 95%);
        transition: 100ms;

        &:hover{
            background-color: #000000;
            color: #fff;
            cursor: pointer;
        }

        &-selected{
            background-color: #00000070;
            color: #fff;
        }
    }

    &--breedlist{
        display: flex;
        flex-direction: column;
        height: 35rem;
        width: 25rem;
        gap: .5rem;
        margin-block: 2.5rem;
        padding: 2rem;
        border-radius: 1rem;
        background-color: lighten($color: #000, $amount: 95%);
        overflow-y: scroll;



        &-breed{
            padding: 1rem;
            font-size: var(--paragraph);
            border-radius: .5rem;
            transition: 100ms;

            &:hover{
                background-color: #000;
                color: #fff;
                cursor: pointer;
            }
        }

        &-btn{
            padding: .5rem;
            background-color: #000;
            color: #fff;
            border-radius: 1rem;

            &:hover{
                background-color: lighten($color: #000000, $amount: 30%);
            }

        }
    }

    &-imageuploader{
        position: relative;
        width: 35rem;
        height: 30rem;
        gap: 1rem;
        margin-block: 2rem;
        background-color: lighten($color: #000000, $amount: 95%);
        border-radius: 1rem;
        overflow-y: auto;


        &-icon{
            font-size: 8rem;
            margin-bottom: 2rem;
        }

        &-input{
            padding: .5rem 1.8rem;
            background-color: #000;
            color: #fff;
            border-radius: 1rem;

            &:hover{
                background-color: lighten($color: #000000, $amount: 30%);
            }

        }

        &-info{
            margin-top: 1rem;
            font-size: var(--small)
        }

        &-action{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        }

    }

    &-imagelist{
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 2rem;
        // border-radius: 1rem;
        // background-color: lighten($color: #000000, $amount: 95%);

        &-item{
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        &-image{
            width: 100%;
            height: 100%;
            object-fit: cover;
            &-wrapper{
                width: 8rem;
                height: 8rem;
                border-radius: 1rem;
                overflow: hidden;
                // box-shadow: 0 0 3rem rgba(0, 0, 0, 0.2);
            }
        }

        &-title{
            font-size: var(--paragraph)
        }

        &-trash{
            font-size: 2.5rem;
            margin-left: auto;
            transition: 100ms;
            &:hover{
                cursor: pointer;
                transform: translateY(-2px);
                scale: 1.01;
            }
        }
    }

    &--preview{
        margin-top: 2rem;
        width: 100%;
        overflow-y: auto
    }


    &-breedinfo{
        position: absolute;
        bottom: 0rem;
        width: 100%;
        height: 90vh;
        background-color: #fff;
        padding: 2rem;
        font-size: var(--paragraph);
        box-shadow: 0 0 3rem rgba(0, 0, 0, 0.2);
        overflow-y: auto;
        overflow-x: hidden;
        transform: translateY(110%);


        &-close{
            position: sticky;
            top: .5rem;
            left: 98.5%;
            font-size: var(--heading5);
            cursor: pointer;
            z-index: 99;
            padding: 1rem;
            background-color: #fff;
            box-shadow: 0 0 3rem rgba(0, 0, 0, 0.2);
            border-radius: 50%;
            transition: 100ms;

            &:hover{
                background-color: darken($color: #fff, $amount: 20%);
            }
        }

        &::-webkit-scrollbar{
            display: none;
        }
    }

}

.gender{
    &-male{
        color: #a2d2ff;
    }
    
    &-female{
        color: #ffa2a2;
    }

    &-active{
        background-color: #000;
        pointer-events: none;
    }
}

.breed{
    &-active{
        background-color: lighten($color: #000000, $amount: 50%);
        color: #fff;
        pointer-events: none;
    }
}

 </style>