import { useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import type { MediaItem } from '@/lib/mediaStorage'
import img1 from '@/assets/images/20241001_203159.jpg'
import img2 from '@/assets/images/_DSC5040.JPG'
import img3 from '@/assets/images/_DSC5146.JPG'
import img4 from '@/assets/images/_DSC5161.JPG'

const samplePhotos: MediaItem[] = [
  {
    id: 'sample-ayakscho-1',
    type: 'image',
    section: 'ayakscho',
    title: 'Перші кроки до свята',
    description: 'Підготовка до найважливішого дня. Дмитро і Александра готуються до церемонії, відчуваючи хвилювання та передчуття чогось особливого. Кожна деталь має значення, кожен момент неповторний.',
    dataUrl: img1,
    uploadedAt: Date.now() - 1000000,
    tags: ['preparation', 'beginning', 'excitement', 'details'],
    metadata: {
      format: 'jpg'
    }
  },
  {
    id: 'sample-ayakscho-2',
    type: 'image',
    section: 'ayakscho',
    title: 'Хвилювання перед церемонією',
    description: 'Останні хвилини перед виходом. Наречена Александра в своєму весільному образі, наречений Дмитро готується зустріти кохану. Атмосфера наповнена очікуванням та ніжністю.',
    dataUrl: img2,
    uploadedAt: Date.now() - 900000,
    tags: ['preparation', 'emotions', 'bride', 'groom', 'anticipation'],
    metadata: {
      format: 'jpg'
    }
  },
  {
    id: 'sample-ayakscho-3',
    type: 'image',
    section: 'ayakscho',
    title: 'Готовність до нового життя',
    description: 'Все готово до початку церемонії. Молодята готові сказати одне одному "так" і розпочати своє спільне життя. Момент перед виходом назустріч майбутньому.',
    dataUrl: img3,
    uploadedAt: Date.now() - 800000,
    tags: ['preparation', 'ready', 'before-ceremony', 'together'],
    metadata: {
      format: 'jpg'
    }
  },
  {
    id: 'sample-razom-1',
    type: 'image',
    section: 'razom',
    title: 'Урочиста клятва вірності',
    description: 'Дмитро і Александра дають обіцянку любити й підтримувати один одного все життя. Це момент, коли дві долі стають єдиним цілим. Урочиста атмосфера церемонії підкреслює значущість події.',
    dataUrl: img4,
    uploadedAt: Date.now() - 700000,
    tags: ['ceremony', 'vows', 'solemn', 'promises', 'unity'],
    metadata: {
      format: 'jpg'
    }
  },
  {
    id: 'sample-razom-2',
    type: 'image',
    section: 'razom',
    title: 'Офіційна церемонія розпису',
    description: 'Підписання офіційних документів, що робить союз Дмитра та Александри законним. Присутні близькі люди, які стають свідками цього історичного моменту в житті молодої сім\'ї.',
    dataUrl: img1,
    uploadedAt: Date.now() - 600000,
    tags: ['ceremony', 'official', 'signing', 'witnesses', 'legal'],
    metadata: {
      format: 'jpg'
    }
  },
  {
    id: 'sample-razom-3',
    type: 'image',
    section: 'razom',
    title: 'Разом назавжди',
    description: 'Тепер Дмитро і Александра офіційно чоловік і дружина. Обмін обручками, перші кроки як подружжя. Емоції переповнюють серця, а очі сяють від щастя.',
    dataUrl: img2,
    uploadedAt: Date.now() - 500000,
    tags: ['ceremony', 'together', 'rings', 'married', 'joy'],
    metadata: {
      format: 'jpg'
    }
  },
  {
    id: 'sample-lyubyty-1',
    type: 'image',
    section: 'lyubyty',
    title: 'Ніжність і близькість',
    description: 'Романтичний момент наодинці. Дмитро обіймає Александру, і весь світ зникає навколо них. Тільки вони вдвох, їхня любов та ніжність, що відчувається в кожному дотику.',
    dataUrl: img3,
    uploadedAt: Date.now() - 400000,
    tags: ['romantic', 'tender', 'intimacy', 'embrace', 'love'],
    metadata: {
      format: 'jpg'
    }
  },
  {
    id: 'sample-lyubyty-2',
    type: 'image',
    section: 'lyubyty',
    title: 'Перший поцілунок як подружжя',
    description: 'Перший поцілунок Дмитра і Александри як чоловіка і дружини. Момент, якого всі чекали, наповнений глибоким почуттям та радістю. Символ їхньої вічної любові.',
    dataUrl: img4,
    uploadedAt: Date.now() - 300000,
    tags: ['romantic', 'kiss', 'first-kiss', 'married', 'emotion'],
    metadata: {
      format: 'jpg'
    }
  },
  {
    id: 'sample-lyubyty-3',
    type: 'image',
    section: 'lyubyty',
    title: 'Кохання без слів',
    description: 'Наш особливий момент, де не потрібні слова. Погляди, усмішки, дотики - все говорить про глибину почуттів. Дмитро і Александра насолоджуються кожною секундою разом.',
    dataUrl: img1,
    uploadedAt: Date.now() - 200000,
    tags: ['romantic', 'love', 'connection', 'wordless', 'intimacy'],
    metadata: {
      format: 'jpg'
    }
  },
  {
    id: 'sample-zhyttya-1',
    type: 'image',
    section: 'zhyttya',
    title: 'Щирість моменту',
    description: 'Живі емоції без постановки та режисури. Дмитро і Александра такі, якими вони є насправді - щирі, відкриті, справжні. Саме ці моменти найкращі.',
    dataUrl: img2,
    uploadedAt: Date.now() - 150000,
    tags: ['casual', 'emotions', 'genuine', 'natural', 'spontaneous'],
    metadata: {
      format: 'jpg'
    }
  },
  {
    id: 'sample-zhyttya-2',
    type: 'image',
    section: 'zhyttya',
    title: 'Справжні ми',
    description: 'Без постановки, без фальші - просто ми. Неформальні моменти часто найкраще розкривають характер людей. Дмитро і Александра у своїй стихії, щасливі й розслаблені.',
    dataUrl: img3,
    uploadedAt: Date.now() - 140000,
    tags: ['casual', 'natural', 'authentic', 'relaxed', 'candid'],
    metadata: {
      format: 'jpg'
    }
  },
  {
    id: 'sample-zhyttya-3',
    type: 'image',
    section: 'zhyttya',
    title: 'Спонтанність життя',
    description: 'Моменти, що трапляються самі собою. Непередбачувані, але такі цінні кадри, де молодята просто живуть і насолоджуються днем. Життя в його найкращому прояві.',
    dataUrl: img4,
    uploadedAt: Date.now() - 130000,
    tags: ['casual', 'spontaneous', 'life', 'unplanned', 'real'],
    metadata: {
      format: 'jpg'
    }
  },
  {
    id: 'sample-pospravzhnomu-1',
    type: 'image',
    section: 'pospravzhnomu',
    title: 'З родиною',
    description: 'Наші близькі люди, що підтримували нас завжди. Батьки, брати, сестри - вся родина зібралася разом, щоб розділити з Дмитром і Александрою цей щасливий день.',
    dataUrl: img1,
    uploadedAt: Date.now() - 120000,
    tags: ['guests', 'family', 'parents', 'relatives', 'support'],
    metadata: {
      format: 'jpg'
    }
  },
  {
    id: 'sample-pospravzhnomu-2',
    type: 'image',
    section: 'pospravzhnomu',
    title: 'З друзями',
    description: 'Ті, хто завжди поруч у радості і в смутку. Друзі Дмитра і Александри прийшли розділити їхнє щастя, підтримати і привітати молодят. Щирі обійми та веселі розмови.',
    dataUrl: img2,
    uploadedAt: Date.now() - 110000,
    tags: ['guests', 'friends', 'support', 'celebration', 'party'],
    metadata: {
      format: 'jpg'
    }
  },
  {
    id: 'sample-pospravzhnomu-3',
    type: 'image',
    section: 'pospravzhnomu',
    title: 'Тости і привітання',
    description: 'Привітання від гостей, теплі слова, побажання щастя. Кожен тост унікальний, кожне побажання йде від серця. Атмосфера наповнена любов\'ю та підтримкою.',
    dataUrl: img3,
    uploadedAt: Date.now() - 100000,
    tags: ['guests', 'toasts', 'wishes', 'speeches', 'celebration'],
    metadata: {
      format: 'jpg'
    }
  },
  {
    id: 'sample-radity-1',
    type: 'image',
    section: 'radity',
    title: 'Перший весільний танець',
    description: 'Наш особливий перший танець як подружжя. Дмитро і Александра в центрі уваги, рухаються в такт музиці, насолоджуючись моментом. Всі гості зачаровано спостерігають за молодятами.',
    dataUrl: img4,
    uploadedAt: Date.now() - 90000,
    tags: ['celebration', 'dance', 'first-dance', 'romantic', 'special'],
    metadata: {
      format: 'jpg'
    }
  },
  {
    id: 'sample-radity-2',
    type: 'image',
    section: 'radity',
    title: 'Веселощі і танці',
    description: 'Енергія вечора зашкалює! Всі танцюють, сміються, веселяться. Дмитро і Александра в оточенні гостей насолоджуються атмосферою свята та безтурботності.',
    dataUrl: img1,
    uploadedAt: Date.now() - 80000,
    tags: ['celebration', 'fun', 'dancing', 'energy', 'party'],
    metadata: {
      format: 'jpg'
    }
  },
  {
    id: 'sample-radity-3',
    type: 'image',
    section: 'radity',
    title: 'Щастя і радість',
    description: 'Сміх, радість, щастя - емоції переповнюють. Молодята і гості відчувають справжню ейфорію від свята. Це ті моменти, що залишаться в пам\'яті назавжди.',
    dataUrl: img2,
    uploadedAt: Date.now() - 70000,
    tags: ['celebration', 'joy', 'happiness', 'laughter', 'emotion'],
    metadata: {
      format: 'jpg'
    }
  },
  {
    id: 'sample-mriyaty-1',
    type: 'image',
    section: 'mriyaty',
    title: 'Наше спільне майбутнє',
    description: 'Разом назустріч мріям і новому життю. Дмитро і Александра дивляться в одному напрямку - в майбутнє, сповнене любові, радості та спільних досягнень.',
    dataUrl: img3,
    uploadedAt: Date.now() - 60000,
    tags: ['future', 'dreams', 'together', 'hopes', 'plans'],
    metadata: {
      format: 'jpg'
    }
  },
  {
    id: 'sample-mriyaty-2',
    type: 'image',
    section: 'mriyaty',
    title: 'Плани на завтра',
    description: 'Все, що попереду - мандрівки, діти, спільний дім, щасливі роки разом. Дмитро і Александра готові до нових викликів, адже вони тепер одна команда.',
    dataUrl: img4,
    uploadedAt: Date.now() - 50000,
    tags: ['future', 'plans', 'goals', 'journey', 'family'],
    metadata: {
      format: 'jpg'
    }
  },
  {
    id: 'sample-mriyaty-3',
    type: 'image',
    section: 'mriyaty',
    title: 'Наша спільна подорож',
    description: 'Життя - це довга подорож, і найкраще, коли поруч є той, з ким хочеш пройти цей шлях. Дмитро і Александра разом, рука в руці, крок за кроком, назустріч своїм мріям.',
    dataUrl: img1,
    uploadedAt: Date.now() - 40000,
    tags: ['future', 'together', 'journey', 'adventure', 'unity'],
    metadata: {
      format: 'jpg'
    }
  },
]

export function useSamplePhotos() {
  const [mediaItems, setMediaItems] = useKV<MediaItem[]>('wedding-media', [])

  useEffect(() => {
    if (!mediaItems || mediaItems.length === 0) {
      setMediaItems(samplePhotos)
    }
  }, [])

  return { mediaItems, setMediaItems }
}
