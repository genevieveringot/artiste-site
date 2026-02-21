const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://okwbohcjgtbunitggcta.supabase.co'
const supabaseKey = 'sb_publishable_LjF5PNi1MaolSKkcwskwWQ_0PyRCuc-'

const supabase = createClient(supabaseUrl, supabaseKey)

// Translations for all sections
const translations = {
  // HOME PAGE
  'home': {
    'hero': {
      title_en: 'I am J. Wattebled | Painter Artist',
      subtitle_en: '',
      description_en: '',
      button_text_en: 'VIEW GALLERY'
    },
    'about': {
      title_en: 'I combine Classical & Modern Art',
      subtitle_en: 'ABOUT THE ARTIST',
      description_en: 'Passionate about art since always, I create works that blend traditional techniques with a contemporary vision. Each painting tells a story, captures an emotion, and invites contemplation.',
      button_text_en: 'Learn more'
    },
    'featured': {
      title_en: 'Discover my collection',
      subtitle_en: 'LATEST WORKS',
      description_en: '',
      button_text_en: 'VIEW ALL'
    },
    'newsletter': {
      title_en: 'Stay informed',
      subtitle_en: '',
      description_en: 'Subscribe to receive news about my latest works and upcoming exhibitions.',
      button_text_en: 'SUBSCRIBE'
    },
    'awards': {
      title_en: 'Awards & Recognition',
      subtitle_en: 'ACHIEVEMENTS',
      description_en: '',
      button_text_en: ''
    },
    'shop': {
      title_en: 'Shop',
      subtitle_en: 'ORIGINAL WORKS',
      description_en: 'Discover my available paintings and find the piece that speaks to you.',
      button_text_en: 'VIEW SHOP'
    }
  },
  // ARTISTE PAGE
  'artiste': {
    'hero': {
      title_en: 'The Artist',
      subtitle_en: '',
      description_en: '',
      button_text_en: ''
    },
    'bio': {
      title_en: 'My Story',
      subtitle_en: 'THE ARTIST',
      description_en: '',
      button_text_en: 'Contact me'
    },
    'parcours': {
      title_en: 'A passion since childhood',
      subtitle_en: 'MY JOURNEY',
      description_en: '',
      button_text_en: 'VIEW GALLERY'
    },
    'atelier': {
      title_en: 'The Studio',
      subtitle_en: 'MY WORKSPACE',
      description_en: 'Discover my creative universe where each painting comes to life.',
      button_text_en: ''
    }
  },
  // CONTACT PAGE
  'contact': {
    'hero': {
      title_en: 'Contact',
      subtitle_en: '',
      description_en: '',
      button_text_en: ''
    },
    'page-header': {
      title_en: 'Contact',
      subtitle_en: '',
      description_en: '',
      button_text_en: ''
    },
    'info': {
      title_en: 'Get in touch',
      subtitle_en: 'CONTACT INFO',
      description_en: 'I would be delighted to discuss your projects or answer your questions.',
      button_text_en: ''
    },
    'form': {
      title_en: 'Send me a message',
      subtitle_en: '',
      description_en: '',
      button_text_en: 'SEND'
    },
    'faq': {
      title_en: 'Frequently Asked Questions',
      subtitle_en: 'FAQ',
      description_en: '',
      button_text_en: ''
    }
  },
  // GALERIE PAGE
  'galerie': {
    'hero': {
      title_en: 'Gallery',
      subtitle_en: '',
      description_en: '',
      button_text_en: ''
    },
    'page-header': {
      title_en: 'Gallery',
      subtitle_en: 'COLLECTIONS',
      description_en: 'Explore my complete collection of paintings.',
      button_text_en: ''
    },
    'gallery': {
      title_en: 'My Works',
      subtitle_en: 'COLLECTION',
      description_en: '',
      button_text_en: ''
    }
  },
  // BOUTIQUE PAGE
  'boutique': {
    'hero': {
      title_en: 'Shop',
      subtitle_en: '',
      description_en: '',
      button_text_en: ''
    },
    'page-header': {
      title_en: 'Shop',
      subtitle_en: 'ORIGINAL WORKS',
      description_en: 'Find the painting that speaks to you.',
      button_text_en: ''
    }
  },
  // EXPOSITIONS PAGE
  'expositions': {
    'hero': {
      title_en: 'Exhibitions',
      subtitle_en: '',
      description_en: '',
      button_text_en: ''
    },
    'page-header': {
      title_en: 'Exhibitions',
      subtitle_en: 'UPCOMING EVENTS',
      description_en: 'Discover where you can see my works in person.',
      button_text_en: ''
    },
    'list': {
      title_en: 'Upcoming Exhibitions',
      subtitle_en: 'EVENTS',
      description_en: '',
      button_text_en: ''
    }
  }
}

async function updateTranslations() {
  console.log('Starting translation updates...\n')
  
  for (const [pageName, sections] of Object.entries(translations)) {
    console.log(`\n📄 Page: ${pageName}`)
    
    for (const [sectionKey, trans] of Object.entries(sections)) {
      // Get the current section
      const { data: section, error: fetchError } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_name', pageName)
        .eq('section_key', sectionKey)
        .single()
      
      if (fetchError || !section) {
        console.log(`  ⏭️  Section "${sectionKey}" not found, skipping`)
        continue
      }
      
      // Merge translations into custom_data
      const newCustomData = {
        ...section.custom_data,
        ...trans
      }
      
      // Update the section
      const { error: updateError } = await supabase
        .from('page_sections')
        .update({ custom_data: newCustomData })
        .eq('id', section.id)
      
      if (updateError) {
        console.log(`  ❌ Error updating "${sectionKey}": ${updateError.message}`)
      } else {
        console.log(`  ✅ Updated "${sectionKey}"`)
      }
    }
  }
  
  console.log('\n\n✨ All translations have been added!')
}

updateTranslations().catch(console.error)
