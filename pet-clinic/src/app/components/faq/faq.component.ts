import { Component, OnInit } from '@angular/core';

interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  allFAQs: FAQ[] = [];
  filteredFAQs: FAQ[] = [];
  categories: string[] = [];
  selectedCategory: string = 'All';
  searchTerm: string = '';

  ngOnInit() {
    this.initializeFAQs();
    this.categories = ['All', ...new Set(this.allFAQs.map(faq => faq.category))];
    this.filteredFAQs = [...this.allFAQs];
  }

  initializeFAQs() {
    this.allFAQs = [
      // General Pet Care
      {
        id: 1,
        category: 'General Pet Care',
        question: 'How often should I bring my pet for a checkup?',
        answer: 'We recommend annual wellness exams for healthy adult pets. Puppies and kittens should visit more frequently (every 3-4 weeks until 16 weeks old), and senior pets (7+ years) should have checkups every 6 months. Pets with chronic conditions may need more frequent visits.',
        isOpen: false
      },
      {
        id: 2,
        category: 'General Pet Care',
        question: 'What vaccinations does my pet need?',
        answer: 'Core vaccinations for dogs include rabies, distemper, parvovirus, and adenovirus. For cats: rabies, feline distemper, and feline leukemia. Additional vaccines may be recommended based on your pet\'s lifestyle and risk factors. We\'ll create a personalized vaccination schedule for your pet.',
        isOpen: false
      },
      {
        id: 3,
        category: 'General Pet Care',
        question: 'How can I tell if my pet is sick?',
        answer: 'Watch for changes in behavior, appetite, energy level, or bathroom habits. Other signs include vomiting, diarrhea, coughing, sneezing, limping, or unusual vocalizations. If you notice any concerning symptoms, contact us immediately. Early detection often leads to better outcomes.',
        isOpen: false
      },
      {
        id: 4,
        category: 'General Pet Care',
        question: 'What should I do in a pet emergency?',
        answer: 'For life-threatening emergencies, call us immediately at +94 25 222 60. Signs of emergency include difficulty breathing, severe bleeding, seizures, inability to walk, or ingestion of toxic substances. Keep our emergency number handy and know the location of the nearest 24-hour veterinary clinic.',
        isOpen: false
      },

      // Appointments & Services
      {
        id: 5,
        category: 'Appointments & Services',
        question: 'How do I schedule an appointment?',
        answer: 'You can schedule an appointment by calling us at +94 25 222 60, visiting our clinic in person, or using our online booking system. We offer flexible scheduling including same-day appointments for urgent cases. New clients are always welcome!',
        isOpen: false
      },
      {
        id: 6,
        category: 'Appointments & Services',
        question: 'What services do you offer?',
        answer: 'We provide comprehensive veterinary care including wellness exams, vaccinations, surgery, dental care, emergency services, diagnostic testing, and preventive care. We also offer specialized services like grooming, boarding, and nutritional counseling.',
        isOpen: false
      },
      {
        id: 7,
        category: 'Appointments & Services',
        question: 'Do you offer emergency services?',
        answer: 'Yes, we provide emergency veterinary care during our regular hours. For after-hours emergencies, we have an on-call veterinarian available. In case of severe emergencies, we can refer you to nearby 24-hour emergency clinics.',
        isOpen: false
      },
      {
        id: 8,
        category: 'Appointments & Services',
        question: 'What are your operating hours?',
        answer: 'We are open Monday through Friday from 8:00 AM to 6:00 PM, and Saturdays from 9:00 AM to 4:00 PM. We are closed on Sundays and major holidays. Emergency services are available during business hours.',
        isOpen: false
      },

      // Pet Health & Nutrition
      {
        id: 9,
        category: 'Pet Health & Nutrition',
        question: 'What should I feed my pet?',
        answer: 'The best diet depends on your pet\'s age, size, breed, and health status. We recommend high-quality commercial pet food that meets AAFCO standards. Avoid feeding table scraps and consult with us for personalized nutritional advice.',
        isOpen: false
      },
      {
        id: 10,
        category: 'Pet Health & Nutrition',
        question: 'How much should my pet eat?',
        answer: 'Feeding amounts vary based on your pet\'s age, weight, activity level, and the type of food. Follow the guidelines on the food package as a starting point, but adjust based on your pet\'s body condition. We can help determine the right amount for your pet.',
        isOpen: false
      },
      {
        id: 11,
        category: 'Pet Health & Nutrition',
        question: 'Is it safe to give my pet human food?',
        answer: 'Most human foods are not safe for pets. Avoid chocolate, grapes, onions, garlic, alcohol, caffeine, and foods high in fat or salt. Some safe options include plain cooked chicken, rice, and certain vegetables. When in doubt, stick to pet-specific food.',
        isOpen: false
      },
      {
        id: 12,
        category: 'Pet Health & Nutrition',
        question: 'How can I help my pet maintain a healthy weight?',
        answer: 'Provide appropriate portion sizes, ensure regular exercise, avoid excessive treats, and monitor your pet\'s body condition. Regular veterinary checkups help us track weight changes and provide guidance on diet and exercise.',
        isOpen: false
      },

      // Pet Behavior & Training
      {
        id: 13,
        category: 'Pet Behavior & Training',
        question: 'How can I stop my pet from chewing on furniture?',
        answer: 'Provide appropriate chew toys, use deterrent sprays, ensure your pet gets enough exercise and mental stimulation, and consider crate training. For persistent issues, consult with us about behavior modification techniques.',
        isOpen: false
      },
      {
        id: 14,
        category: 'Pet Behavior & Training',
        question: 'My pet is aggressive. What should I do?',
        answer: 'Aggression can have medical or behavioral causes. First, schedule a veterinary exam to rule out health issues. We can refer you to a certified animal behaviorist for training and behavior modification. Never punish aggressive behavior as it may worsen the problem.',
        isOpen: false
      },
      {
        id: 15,
        category: 'Pet Behavior & Training',
        question: 'How do I house train my puppy?',
        answer: 'Establish a regular feeding schedule, take your puppy outside frequently (especially after meals), use positive reinforcement, and be patient. Consistency is key. Most puppies are fully house trained by 6 months of age.',
        isOpen: false
      },
      {
        id: 16,
        category: 'Pet Behavior & Training',
        question: 'Why is my cat not using the litter box?',
        answer: 'Medical issues, stress, dirty litter boxes, or inappropriate litter type can cause this behavior. Ensure clean litter boxes, try different litter types, and schedule a veterinary exam to rule out health problems.',
        isOpen: false
      },

      // Pet Safety & Prevention
      {
        id: 17,
        category: 'Pet Safety & Prevention',
        question: 'How can I prevent fleas and ticks?',
        answer: 'Use veterinarian-recommended flea and tick preventives year-round. Keep your yard maintained, check your pet regularly, and treat your home if needed. We can recommend the best products for your pet\'s specific needs.',
        isOpen: false
      },
      {
        id: 18,
        category: 'Pet Safety & Prevention',
        question: 'Should I spay or neuter my pet?',
        answer: 'Yes, spaying and neutering provide health benefits and prevent unwanted litters. We recommend spaying/neutering between 4-6 months of age. These procedures can reduce the risk of certain cancers and behavioral problems.',
        isOpen: false
      },
      {
        id: 19,
        category: 'Pet Safety & Prevention',
        question: 'How can I keep my pet safe during holidays?',
        answer: 'Keep pets away from toxic foods, secure decorations, provide a quiet space during celebrations, and ensure proper identification. Consider boarding or pet-sitting services if you\'ll be away. We can provide specific holiday safety tips.',
        isOpen: false
      },
      {
        id: 20,
        category: 'Pet Safety & Prevention',
        question: 'What should I do if my pet gets lost?',
        answer: 'Immediately search your neighborhood, contact local shelters and veterinary clinics, post on social media, and check online lost pet databases. Ensure your pet has proper identification including a collar with tags and consider microchipping.',
        isOpen: false
      },

      // Senior Pet Care
      {
        id: 21,
        category: 'Senior Pet Care',
        question: 'When is my pet considered a senior?',
        answer: 'Dogs are typically considered senior at 7 years, though large breeds may age faster. Cats are considered senior at 11 years. Senior pets need more frequent veterinary care and may require dietary and lifestyle adjustments.',
        isOpen: false
      },
      {
        id: 22,
        category: 'Senior Pet Care',
        question: 'What special care do senior pets need?',
        answer: 'Senior pets benefit from more frequent veterinary checkups, blood work monitoring, joint supplements, modified exercise routines, and special diets. We can create a personalized senior care plan for your pet.',
        isOpen: false
      },
      {
        id: 23,
        category: 'Senior Pet Care',
        question: 'How can I help my senior pet with arthritis?',
        answer: 'Provide soft bedding, use ramps for furniture access, maintain a healthy weight, consider joint supplements, and provide gentle exercise. We can prescribe medications and recommend therapies to manage arthritis pain.',
        isOpen: false
      },
      {
        id: 24,
        category: 'Senior Pet Care',
        question: 'Should I change my senior pet\'s diet?',
        answer: 'Senior pets often benefit from specially formulated senior diets that are lower in calories, higher in fiber, and contain joint-supporting nutrients. We can recommend the best diet for your senior pet\'s specific needs.',
        isOpen: false
      }
    ];
  }

  toggleFAQ(faq: FAQ) {
    faq.isOpen = !faq.isOpen;
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.filterFAQs();
  }

  filterFAQs() {
    let filtered = this.allFAQs;

    // Filter by category
    if (this.selectedCategory !== 'All') {
      filtered = filtered.filter(faq => faq.category === this.selectedCategory);
    }

    // Filter by search term
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(searchLower) ||
        faq.answer.toLowerCase().includes(searchLower) ||
        faq.category.toLowerCase().includes(searchLower)
      );
    }

    this.filteredFAQs = filtered;
  }

  clearSearch() {
    this.searchTerm = '';
    this.filterFAQs();
  }
}
