
// Practice Section Smooth Interactive Handlers (Chuyển tab mượt mà, không cần bấm ẩn)
window.togglePracticeMindmap = function(tid, btn) {
    const card = document.getElementById('card-' + tid) || (btn ? btn.closest('.practice-topic-card') : null);
    if (!card) return;
    
    const mmDrawer = document.getElementById('mm-drawer-' + tid);
    const fuDrawer = document.getElementById('fu-drawer-' + tid);
    const mmBtn = btn || card.querySelector('.btn-mindmap-toggle');
    const fuBtn = card.querySelector('.btn-followups-toggle');

    if (!mmDrawer) return;

    const isCurrentlyOpen = mmDrawer.style.display !== 'none' && mmDrawer.style.display !== '';

    if (isCurrentlyOpen) {
        // Bấm lại chính nó -> Đóng lại
        mmDrawer.style.display = 'none';
        if (mmBtn) mmBtn.classList.remove('active-tab');
    } else {
        // Tự động đóng tab câu hỏi mở rộng nếu đang mở (không cần học viên bấm Ẩn thủ công)
        if (fuDrawer) {
            fuDrawer.style.display = 'none';
        }
        if (fuBtn) {
            fuBtn.classList.remove('active-tab');
        }

        // Mở mượt mà tab sơ đồ tư duy
        mmDrawer.style.display = 'block';
        if (mmBtn) mmBtn.classList.add('active-tab');
    }
};

window.togglePracticeFollowups = function(tid, btn) {
    const card = document.getElementById('card-' + tid) || (btn ? btn.closest('.practice-topic-card') : null);
    if (!card) return;
    
    const mmDrawer = document.getElementById('mm-drawer-' + tid);
    const fuDrawer = document.getElementById('fu-drawer-' + tid);
    const mmBtn = card.querySelector('.btn-mindmap-toggle');
    const fuBtn = btn || card.querySelector('.btn-followups-toggle');

    if (!fuDrawer) return;

    const isCurrentlyOpen = fuDrawer.style.display !== 'none' && fuDrawer.style.display !== '';

    if (isCurrentlyOpen) {
        // Bấm lại chính nó -> Đóng lại
        fuDrawer.style.display = 'none';
        if (fuBtn) fuBtn.classList.remove('active-tab');
    } else {
        // Tự động đóng tab sơ đồ tư duy nếu đang mở
        if (mmDrawer) {
            mmDrawer.style.display = 'none';
        }
        if (mmBtn) {
            mmBtn.classList.remove('active-tab');
        }

        // Mở mượt mà tab câu hỏi mở rộng
        fuDrawer.style.display = 'block';
        if (fuBtn) fuBtn.classList.add('active-tab');
    }
};

window.startSimWithTopic = function(tid) {
    const isTeacher = state.student.isTeacher || (typeof checkIfTeacher === 'function' && checkIfTeacher(state.student.name, state.student.classCode));
    const topic = ALL_TOPICS_POOL.find(t => t.id === tid);
    if (!isTeacher && topic && topic.category !== 'benefits') {
        showToast('🔒 Đề thi này thuộc nhóm đang tạm khóa cho lớp B212!');
        return;
    }
    // Navigate to simulator tab
    if (typeof window.switchTab === 'function') {
        window.switchTab('tool-simulator');
    } else {
        const simNav = document.querySelector('[data-target="tool-simulator"]');
        if (simNav) simNav.click();
    }
    
    // Select topic in simulator dropdown
    setTimeout(() => {
        const select = document.getElementById('sim-topic-select');
        if (select) {
            select.value = tid;
            select.dispatchEvent(new Event('change'));
        }
        const simPane = document.getElementById('tool-simulator');
        if (simPane) simPane.scrollIntoView({ behavior: 'smooth' });
    }, 200);
};


window.copyCardSample = function(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const text = el.innerText;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Đã sao chép toàn bộ bài mẫu vào bộ nhớ tạm!');
        });
    } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('Đã sao chép toàn bộ bài mẫu vào bộ nhớ tạm!');
    }
};

/**
 * VSTEP SPEAKING PART 03 - TOPIC DEVELOPMENT PORTAL
 * Interactive Engine: Speech Synthesis, Exam Simulator, Audio Recorder, Flashcards
 * Dedicated to Ms. Nguyet's Students
 */

// Master Topics Pool
const ALL_TOPICS_POOL = [
  {
    "id": "b-topic-01",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 01",
    "title": "Teamwork brings people many benefits.",
    "center": "Teamwork",
    "branches": [
      {
        "num": 1,
        "text": "Improve communication skills",
        "pos": "top",
        "type": "verb",
        "vi": "Cải thiện kỹ năng giao tiếp"
      },
      {
        "num": 2,
        "text": "Strengthen team relationships",
        "pos": "right",
        "type": "verb",
        "vi": "Thắt chặt mối quan hệ nhóm"
      },
      {
        "num": 3,
        "text": "Develop leadership qualities",
        "pos": "bottom",
        "type": "verb",
        "vi": "Phát triển phẩm chất lãnh đạo"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "What are some disadvantages of working in a team?",
        "vi": "Những bất lợi của việc làm việc nhóm là gì?",
        "a": "One major disadvantage is that members may <strong>have conflicting opinions</strong>, which can lead to heated arguments and delay project deadlines. Furthermore, some individuals might <strong>rely too much on others</strong>, creating an unfair division of work."
      },
      {
        "q": "In your opinion, how can organizations encourage effective teamwork?",
        "vi": "Theo bạn, các tổ chức có thể khuyến khích làm việc nhóm hiệu quả bằng cách nào?",
        "a": "Organizations should <strong>set clear common goals and define specific roles</strong> so that each member understands their contribution. In addition, <strong>organizing regular team-building activities</strong> can help employees connect and cooperate more smoothly."
      },
      {
        "q": "Do you think teamwork is more beneficial for young people or older people? Why?",
        "vi": "Bạn có nghĩ làm việc nhóm có lợi hơn cho người trẻ hay người lớn tuổi?",
        "a": "I believe teamwork is particularly <strong>beneficial for young people</strong> because they are still building essential workplace skills. Collaborating with others teaches them how to <strong>accept constructive feedback and adapt quickly</strong> to professional environments."
      }
    ]
  },
  {
    "id": "b-topic-02",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 02",
    "title": "Soft skills are very important in modern society.",
    "center": "Soft skills",
    "branches": [
      {
        "num": 1,
        "text": "Improve work performance",
        "pos": "top",
        "type": "verb",
        "vi": "Nâng cao hiệu suất công việc"
      },
      {
        "num": 2,
        "text": "Create job opportunities",
        "pos": "right",
        "type": "verb",
        "vi": "Tạo nhiều cơ hội việc làm"
      },
      {
        "num": 3,
        "text": "Improve social relationships",
        "pos": "bottom",
        "type": "verb",
        "vi": "Cải thiện các mối quan hệ xã hội"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "Do you think soft skills are necessary in today’s society? Why or why not?",
        "vi": "Bạn có nghĩ kỹ năng mềm là cần thiết trong xã hội ngày nay không?",
        "a": "Yes, I strongly believe soft skills are essential today because <strong>academic degrees alone cannot guarantee career success</strong>. Possessing good interpersonal skills enables individuals to <strong>communicate effectively and collaborate well</strong> with diverse groups of people."
      },
      {
        "q": "Which soft skill do you think is the most important?",
        "vi": "Kỹ năng mềm nào bạn nghĩ là quan trọng nhất?",
        "a": "In my opinion, <strong>effective communication is the most crucial skill</strong> because it forms the foundation of all professional interactions. When people express ideas clearly and listen attentively, they can <strong>avoid misunderstandings and solve problems much faster</strong>."
      },
      {
        "q": "Do you think young people generally have better soft skills than older people?",
        "vi": "Bạn có nghĩ người trẻ nhìn chung có kỹ năng mềm tốt hơn người lớn tuổi không?",
        "a": "I think each generation has distinct strengths. While young people are often <strong>more adaptable and comfortable with digital communication</strong>, older individuals usually possess <strong>better emotional control and real-world negotiation skills</strong> gained from life experience."
      }
    ]
  },
  {
    "id": "b-topic-03",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 03",
    "title": "Online learning is beneficial to students.",
    "center": "Online learning",
    "branches": [
      {
        "num": 1,
        "text": "Flexible",
        "pos": "top",
        "type": "adj",
        "vi": "Linh hoạt về thời gian & địa điểm"
      },
      {
        "num": 2,
        "text": "Time-saving",
        "pos": "right",
        "type": "adj",
        "vi": "Tiết kiệm thời gian đi lại"
      },
      {
        "num": 3,
        "text": "Money-saving",
        "pos": "bottom",
        "type": "adj",
        "vi": "Tiết kiệm chi phí sinh hoạt & học tập"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "Do you think online learning will replace traditional schooling in the future?",
        "vi": "Học online có thay thế trường học truyền thống không?",
        "a": "I do not think online learning will completely replace traditional schools because <strong>face-to-face interaction is indispensable</strong>. Being in a physical classroom provides hands-on practice and helps students <strong>develop essential social manners and communication skills</strong> naturally."
      },
      {
        "q": "What are some disadvantages of online learning?",
        "vi": "Một số bất lợi của học trực tuyến?",
        "a": "One significant drawback is the lack of direct supervision, which makes it easy for students to <strong>get distracted by games or social media</strong>. In addition, staring at computer screens for long periods can cause <strong>eye strain and feelings of isolation</strong>."
      },
      {
        "q": "How can students study online more effectively?",
        "vi": "Làm thế nào để học trực tuyến hiệu quả hơn?",
        "a": "Students can study more effectively by <strong>creating a quiet study corner and following a regular daily schedule</strong>. Moreover, <strong>actively participating in virtual discussions and taking thorough notes</strong> will help them comprehend lessons much deeper."
      }
    ]
  },
  {
    "id": "b-topic-04",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 04",
    "title": "Body language plays an important role in communication.",
    "center": "Body language",
    "branches": [
      {
        "num": 1,
        "text": "Overcome language barriers",
        "pos": "top",
        "type": "verb",
        "vi": "Vượt qua rào cản ngôn ngữ"
      },
      {
        "num": 2,
        "text": "Enhance mutual understanding",
        "pos": "right",
        "type": "verb",
        "vi": "Tăng cường sự hiểu biết lẫn nhau"
      },
      {
        "num": 3,
        "text": "Show emotions and attitudes",
        "pos": "bottom",
        "type": "verb",
        "vi": "Thể hiện cảm xúc và thái độ"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "Why is body language important in presentations?",
        "vi": "Tại sao ngôn ngữ cơ thể quan trọng trong thuyết trình?",
        "a": "Body language is crucial in presentations because it <strong>captures the audience's attention and conveys confidence</strong>. Maintaining natural eye contact and purposeful gestures helps <strong>emphasize key arguments and keep listeners engaged</strong>."
      },
      {
        "q": "Can body language cause misunderstandings in different cultures?",
        "vi": "Ngôn ngữ cơ thể có gây hiểu lầm giữa các nền văn hóa không?",
        "a": "Yes, absolutely, because common gestures carry contrasting meanings in different countries. For instance, while a <strong>thumbs-up is encouraging in Western nations</strong>, it can be <strong>viewed as an offensive insult</strong> in certain Middle Eastern cultures."
      },
      {
        "q": "How can people improve their body language?",
        "vi": "Làm thế nào để cải thiện ngôn ngữ cơ thể?",
        "a": "People can improve by <strong>recording their rehearsals and observing their posture and gestures</strong>. Furthermore, practicing an open posture and <strong>maintaining comfortable eye contact</strong> during daily conversations will build natural confidence."
      }
    ]
  },
  {
    "id": "b-topic-05",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 05",
    "title": "Studying abroad is very beneficial for young people.",
    "center": "Studying abroad",
    "branches": [
      {
        "num": 1,
        "text": "Develop themselves",
        "pos": "top",
        "type": "verb",
        "vi": "Phát triển bản thân toàn diện"
      },
      {
        "num": 2,
        "text": "See the world",
        "pos": "right",
        "type": "verb",
        "vi": "Khám phá thế giới rộng lớn"
      },
      {
        "num": 3,
        "text": "Experience different styles of education",
        "pos": "bottom",
        "type": "verb",
        "vi": "Trải nghiệm nền giáo dục tiên tiến"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "What difficulties do international students often face?",
        "vi": "Du học sinh thường gặp khó khăn gì?",
        "a": "International students frequently struggle with <strong>language barriers, severe homesickness, and cultural differences</strong>. In addition, adapting to unfamiliar local cuisine and <strong>managing living expenses on a strict budget</strong> can be quite stressful."
      },
      {
        "q": "Should students work part-time while studying abroad?",
        "vi": "Du học sinh có nên làm thêm không?",
        "a": "I think part-time employment is beneficial because it <strong>provides extra income and practical communication experience</strong> with locals. However, students must manage their time sensibly so that work does not <strong>interfere with their academic assignments</strong>."
      },
      {
        "q": "Do you prefer studying abroad or studying in your home country?",
        "vi": "Bạn thích du học hay học trong nước?",
        "a": "Personally, I prefer studying abroad because it <strong>pushes me out of my comfort zone and accelerates my language proficiency</strong>. Experiencing a competitive global environment also provides <strong>better job prospects after graduation</strong>."
      }
    ]
  },
  {
    "id": "b-topic-06",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 06",
    "title": "Learning English brings many benefits in different areas of life.",
    "center": "Learning English",
    "branches": [
      {
        "num": 1,
        "text": "Communication",
        "pos": "top",
        "type": "noun",
        "vi": "Giao tiếp toàn cầu"
      },
      {
        "num": 2,
        "text": "Career and job opportunities",
        "pos": "right",
        "type": "noun",
        "vi": "Cơ hội việc làm rộng mở"
      },
      {
        "num": 3,
        "text": "Academic purposes",
        "pos": "bottom",
        "type": "noun",
        "vi": "Mục đích học thuật & nghiên cứu"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "At what age should children start learning English?",
        "vi": "Trẻ em nên học tiếng Anh từ mấy tuổi?",
        "a": "I believe children should start learning English around five or six years old after establishing their native mother tongue. At this receptive age, kids can <strong>absorb authentic pronunciation naturally through playful songs and cartoons</strong>."
      },
      {
        "q": "What is the best way to practice English speaking?",
        "vi": "Cách tốt nhất để luyện nói tiếng Anh?",
        "a": "The best method is to <strong>practice conversing regularly with native speakers or join English speaking clubs</strong>. In addition, <strong>shadowing English podcasts and talking to oneself daily</strong> helps build natural rhythm and spoken confidence."
      },
      {
        "q": "Is English the most useful language in the world?",
        "vi": "Tiếng Anh có phải là ngôn ngữ hữu ích nhất?",
        "a": "Yes, English remains the most useful language because it serves as the <strong>primary medium in international trade, aviation, and the Internet</strong>. Even though other languages have huge populations, English is the <strong>universal bridge connecting people worldwide</strong>."
      }
    ]
  },
  {
    "id": "b-topic-07",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 07",
    "title": "Sending children to preschool early brings certain benefits.",
    "center": "Preschool early",
    "branches": [
      {
        "num": 1,
        "text": "Become more independent and sociable",
        "pos": "top",
        "type": "verb",
        "vi": "Tự lập và hòa đồng hơn"
      },
      {
        "num": 2,
        "text": "Better preparation for formal schooling",
        "pos": "right",
        "type": "noun",
        "vi": "Chuẩn bị tốt cho trường tiểu học"
      },
      {
        "num": 3,
        "text": "Support parents in balancing work and life",
        "pos": "bottom",
        "type": "verb",
        "vi": "Giúp cha mẹ an tâm làm việc"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "Are there any disadvantages of sending toddlers to school early?",
        "vi": "Có bất lợi gì khi cho trẻ đi học sớm?",
        "a": "One major issue is separation anxiety, which can cause <strong>young toddlers to feel insecure and cry frequently</strong> during the first few weeks. Furthermore, spending time in group settings <strong>increases their exposure to contagious illnesses</strong> like colds and flu."
      },
      {
        "q": "What should parents look for when choosing a preschool?",
        "vi": "Phụ huynh nên chú ý điều gì khi chọn trường mầm non?",
        "a": "Parents should prioritize a <strong>clean, secure physical environment with patient, well-trained educators</strong>. In addition, an engaging curriculum that balances <strong>creative play with outdoor motor activities</strong> is essential for healthy child growth."
      },
      {
        "q": "Should preschool focus on academics or playtime?",
        "vi": "Mầm non nên chú trọng học chữ hay vui chơi?",
        "a": "I firmly believe preschool should emphasize <strong>play-based learning and social cooperation rather than rigid academics</strong>. At this early developmental stage, building curiosity, kindness, and communication skills is <strong>far more valuable than memorizing formal letters</strong>."
      }
    ]
  },
  {
    "id": "b-topic-08",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 08",
    "title": "Good workplace relationships bring many benefits.",
    "center": "Good workplace relationships",
    "branches": [
      {
        "num": 1,
        "text": "Higher levels of job satisfaction",
        "pos": "top",
        "type": "noun",
        "vi": "Mức độ hài lòng công việc cao"
      },
      {
        "num": 2,
        "text": "Higher levels of creativity",
        "pos": "right",
        "type": "noun",
        "vi": "Khuyến khích sự sáng tạo"
      },
      {
        "num": 3,
        "text": "Higher levels of cooperation and teamwork",
        "pos": "bottom",
        "type": "noun",
        "vi": "Tăng cường hợp tác nhóm"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "How can conflicts between coworkers be resolved?",
        "vi": "Làm thế nào giải quyết mâu thuẫn đồng nghiệp?",
        "a": "Coworkers should arrange a private conversation to <strong>discuss their differences objectively and listen with empathy</strong>. If they fail to find common ground, involving a neutral department manager can help <strong>reach a constructive and peaceful compromise</strong>."
      },
      {
        "q": "Is having close friends at work always positive?",
        "vi": "Có bạn thân ở nơi làm việc có luôn tốt không?",
        "a": "While close workplace friendships provide great emotional support, they can occasionally lead to <strong>distractions, office gossip, or accusations of bias</strong>. Therefore, professionals should always <strong>separate personal friendships from objective work decisions</strong>."
      },
      {
        "q": "What can a company do to build a friendly work culture?",
        "vi": "Công ty có thể làm gì để xây dựng văn hóa thân thiện?",
        "a": "Companies can sponsor casual social events such as <strong>monthly team lunches, birthday parties, or annual team retreats</strong>. In addition, designing collaborative office layouts encourages employees across departments to <strong>interact and build friendships organically</strong>."
      }
    ]
  },
  {
    "id": "b-topic-09",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 09",
    "title": "Reading brings many benefits to people of all ages.",
    "center": "Reading",
    "branches": [
      {
        "num": 1,
        "text": "Relax",
        "pos": "top",
        "type": "verb",
        "vi": "Thư giãn tinh thần"
      },
      {
        "num": 2,
        "text": "Widen knowledge",
        "pos": "right",
        "type": "verb",
        "vi": "Mở rộng hiểu biết sâu rộng"
      },
      {
        "num": 3,
        "text": "Improve memory and focus",
        "pos": "bottom",
        "type": "verb",
        "vi": "Cải thiện trí nhớ và tập trung"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "Do you prefer physical books or e-books?",
        "vi": "Bạn thích sách giấy hay sách điện tử?",
        "a": "I personally prefer physical print books because the <strong>tangible texture of paper and turning pages feels deeply calming</strong>. Furthermore, reading printed books <strong>eliminates digital eye strain and prevents notifications</strong> from interrupting concentration."
      },
      {
        "q": "How can parents encourage kids to read more?",
        "vi": "Làm sao cha mẹ khuyến khích con đọc sách?",
        "a": "Parents should set a role model by <strong>reading books regularly at home rather than browsing on smartphones</strong>. In addition, filling home shelves with <strong>colorful illustrated storybooks and reading bedtime tales together</strong> will inspire a lifelong reading habit."
      },
      {
        "q": "Why do some people read less nowadays?",
        "vi": "Tại sao ngày nay nhiều người ít đọc sách?",
        "a": "Many people read less because they are addicted to <strong>bite-sized entertainment on social platforms like TikTok and Instagram</strong>. These instant visual dopamine hits make reading lengthy chapters feel <strong>too slow, demanding, and less attractive</strong>."
      }
    ]
  },
  {
    "id": "b-topic-10",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 10",
    "title": "Artificial Intelligence brings many benefits to modern life.",
    "center": "Artificial Intelligence (AI)",
    "branches": [
      {
        "num": 1,
        "text": "Improve healthcare",
        "pos": "top",
        "type": "verb",
        "vi": "Nâng cao chất lượng y tế"
      },
      {
        "num": 2,
        "text": "Facilitate teaching and learning",
        "pos": "right",
        "type": "verb",
        "vi": "Hỗ trợ dạy và học hiệu quả"
      },
      {
        "num": 3,
        "text": "Handle daily repetitive tasks",
        "pos": "bottom",
        "type": "verb",
        "vi": "Xử lý công việc lặp đi lặp lại"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "Will AI take away people's jobs?",
        "vi": "AI có cướp mất việc làm không?",
        "a": "While AI will inevitably replace routine manual and clerical jobs, it will also <strong>generate new career fields in prompt design and data supervision</strong>. Therefore, workers need to <strong>upgrade their technical skills and adapt to working alongside AI</strong>."
      },
      {
        "q": "How do you use AI in your daily study or work?",
        "vi": "Bạn dùng AI trong học tập thế nào?",
        "a": "I often use AI tools to <strong>proofread grammar in my English essays and brainstorm essay outlines</strong>. Furthermore, asking AI to <strong>summarize lengthy articles into bullet points saves me hours of study time</strong>."
      },
      {
        "q": "What ethical risks come with AI development?",
        "vi": "Nguy cơ đạo đức nào đi kèm với AI?",
        "a": "Major ethical concerns include <strong>unauthorized personal data harvesting and algorithmic discrimination</strong>. In addition, the widespread creation of realistic deepfakes can <strong>spread false information and deceive the public</strong>."
      }
    ]
  },
  {
    "id": "b-topic-11",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 11",
    "title": "Maintaining work–life balance is important for everyone.",
    "center": "Work-life balance",
    "branches": [
      {
        "num": 1,
        "text": "Make time for personal hobbies",
        "pos": "top",
        "type": "verb",
        "vi": "Dành thời gian cho sở thích"
      },
      {
        "num": 2,
        "text": "Build personal relationships",
        "pos": "right",
        "type": "verb",
        "vi": "Gắn kết tình cảm gia đình"
      },
      {
        "num": 3,
        "text": "Have time to relax and recover",
        "pos": "bottom",
        "type": "verb",
        "vi": "Thư giãn phục hồi năng lượng"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "Why is work-life balance difficult in modern cities?",
        "vi": "Tại sao cân bằng khó ở thành phố?",
        "a": "Achieving balance in metropolitan areas is tough due to <strong>heavy career competition, long traffic commutes, and soaring living costs</strong>. Moreover, smartphone notifications mean employees are <strong>frequently expected to answer work messages after hours</strong>."
      },
      {
        "q": "What happens if someone ignores work-life balance?",
        "vi": "Chuyện gì xảy ra nếu bỏ qua cân bằng?",
        "a": "Prolonged neglect of balance leads to <strong>severe mental burnout, insomnia, and higher risks of health complications</strong>. Eventually, strained relationships with family and <strong>declining productivity at work become unavoidable</strong>."
      },
      {
        "q": "How can employers support their workers' balance?",
        "vi": "Doanh nghiệp hỗ trợ nhân viên thế nào?",
        "a": "Employers can provide <strong>flexible working hours and avoid assigning overtime tasks during weekends</strong>. Furthermore, offering wellness initiatives like <strong>subsidized gym memberships or counseling services</strong> shows genuine support for employee well-being."
      }
    ]
  },
  {
    "id": "b-topic-12",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 12",
    "title": "Travelling brings many benefits to people’s lives.",
    "center": "Traveling",
    "branches": [
      {
        "num": 1,
        "text": "Explore different cultures",
        "pos": "top",
        "type": "verb",
        "vi": "Khám phá các nền văn hóa"
      },
      {
        "num": 2,
        "text": "Make new friends",
        "pos": "right",
        "type": "verb",
        "vi": "Kết nối thêm bạn bè mới"
      },
      {
        "num": 3,
        "text": "Reduce stress and refresh mind",
        "pos": "bottom",
        "type": "verb",
        "vi": "Giảm căng thẳng mệt mỏi"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "Do you prefer traveling alone or in a group?",
        "vi": "Bạn thích du lịch một mình hay theo nhóm?",
        "a": "Personally, I prefer traveling in a small group of friends because <strong>sharing meals and taking photos together makes the trip much more memorable</strong>. In addition, traveling with companions provides <strong>mutual safety and helps split travel expenses</strong>."
      },
      {
        "q": "Is eco-tourism becoming more popular?",
        "vi": "Du lịch sinh thái có đang phổ biến không?",
        "a": "Yes, eco-tourism is growing rapidly because modern travelers are <strong>increasingly concerned about protecting natural habitats and supporting local communities</strong>. People now prefer <strong>sustainable outdoor excursions over noisy commercial resorts</strong>."
      },
      {
        "q": "What should travelers prepare before visiting another country?",
        "vi": "Cần chuẩn bị gì trước chuyến đi nước ngoài?",
        "a": "Travelers must ensure their passport has sufficient validity, <strong>acquire foreign currency, and purchase comprehensive travel insurance</strong>. Furthermore, researching <strong>local customs and etiquette will help prevent awkward cultural mistakes</strong>."
      }
    ]
  },
  {
    "id": "b-topic-13",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 13",
    "title": "Doing charity work brings many personal benefits.",
    "center": "Charity work",
    "branches": [
      {
        "num": 1,
        "text": "Show gratitude and appreciation for life",
        "pos": "top",
        "type": "verb",
        "vi": "Biết ơn và trân trọng cuộc sống"
      },
      {
        "num": 2,
        "text": "Learn to take responsibility",
        "pos": "right",
        "type": "verb",
        "vi": "Học cách sống có trách nhiệm"
      },
      {
        "num": 3,
        "text": "Acquire useful social skills",
        "pos": "bottom",
        "type": "verb",
        "vi": "Rèn luyện kỹ năng xã hội hữu ích"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "Should schools make volunteering mandatory for students?",
        "vi": "Trường học có nên bắt buộc học sinh đi tình nguyện?",
        "a": "I believe volunteering should be <strong>warmly encouraged rather than strictly mandatory</strong>. When students engage in charity out of genuine compassion, the experience is <strong>truly transformative rather than feeling like a chore</strong>."
      },
      {
        "q": "How can people help the needy besides donating money?",
        "vi": "Giúp người nghèo bằng cách nào ngoài tiền?",
        "a": "People can contribute their personal time by <strong>tutoring underprivileged children or serving hot meals at local community shelters</strong>. Furthermore, donating gently used clothing, warm blankets, or books can <strong>bring immense comfort to struggling families</strong>."
      },
      {
        "q": "Have you ever participated in a charity project?",
        "vi": "Bạn đã từng tham gia hoạt động từ thiện nào chưa?",
        "a": "Yes, I once joined a school volunteer trip to <strong>distribute warm coats and notebooks to children in a remote mountainous village</strong>. Seeing their joyful smiles made me <strong>deeply appreciate the positive impact of sharing</strong>."
      }
    ]
  },
  {
    "id": "b-topic-14",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 14",
    "title": "Spending holidays at home can be a good choice.",
    "center": "Holidays at home",
    "branches": [
      {
        "num": 1,
        "text": "Inexpensive",
        "pos": "top",
        "type": "adj",
        "vi": "Tiết kiệm chi phí"
      },
      {
        "num": 2,
        "text": "Relaxing and comfortable",
        "pos": "right",
        "type": "adj",
        "vi": "Thư giãn, không ồn ào"
      },
      {
        "num": 3,
        "text": "Safe and peaceful",
        "pos": "bottom",
        "type": "adj",
        "vi": "An toàn, tránh kẹt xe"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "What fun activities can people do when staying home during holidays?",
        "vi": "Những hoạt động thú vị tại nhà trong kỳ nghỉ?",
        "a": "People can host <strong>cozy barbecue meals with relatives, binge-watch fascinating movie series, or bake new recipes</strong>. In addition, taking time to <strong>reorganize living spaces or read unfinished books</strong> can be surprisingly fulfilling."
      },
      {
        "q": "Why do some people dislike staying at home on holidays?",
        "vi": "Tại sao vài người không thích ở nhà ngày lễ?",
        "a": "Some people find staying home repetitive because remaining in the same domestic space can <strong>feel like an ordinary boring weekend</strong>. They desire the excitement of <strong>exploring new landscapes, taking vibrant photos, and discovering different cultures</strong>."
      },
      {
        "q": "Is holiday traffic a big problem in your country?",
        "vi": "Giao thông ngày lễ có là vấn đề lớn không?",
        "a": "Yes, absolutely, traffic jams during major national holidays like Tet are a notorious problem. Millions of people travel simultaneously, causing <strong>prolonged bottlenecks that can trap vehicles on highways for hours</strong>."
      }
    ]
  },
  {
    "id": "b-topic-15",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 15",
    "title": "Older leaders can be more effective in certain situations.",
    "center": "Older leaders",
    "branches": [
      {
        "num": 1,
        "text": "More experienced",
        "pos": "top",
        "type": "adj",
        "vi": "Nhiều kinh nghiệm thực chiến"
      },
      {
        "num": 2,
        "text": "More knowledgeable",
        "pos": "right",
        "type": "adj",
        "vi": "Kiến thức sâu rộng"
      },
      {
        "num": 3,
        "text": "More responsible and calm",
        "pos": "bottom",
        "type": "adj",
        "vi": "Điềm tĩnh và trách nhiệm"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "What advantages do young leaders have over older leaders?",
        "vi": "Lãnh đạo trẻ có ưu thế gì so với người lớn tuổi?",
        "a": "Young leaders are typically <strong>more energetic, tech-savvy, and receptive to modern business trends</strong>. Their innovative mindset helps them <strong>inspire young team members and embrace bold organizational transformations</strong>."
      },
      {
        "q": "Should there be an age limit for political leaders?",
        "vi": "Có nên giới hạn tuổi cho chính trị gia không?",
        "a": "I believe having a sensible retirement age can <strong>encourage healthy leadership succession and welcome innovative youth perspectives</strong>. However, regulations should remain flexible enough to <strong>retain experienced leaders who maintain sharp mental acuity</strong>."
      },
      {
        "q": "What makes a truly inspiring leader?",
        "vi": "Điều gì tạo nên một nhà lãnh đạo truyền cảm hứng?",
        "a": "An inspiring leader is someone who <strong>leads by ethical example and listens with authentic humility</strong>. Instead of merely giving commands, they <strong>empower teammates and support them in achieving collective success</strong>."
      }
    ]
  },
  {
    "id": "d-topic-01",
    "category": "drawbacks",
    "categoryName": "Nhóm Bất Lợi",
    "topicCode": "ĐỀ SỐ 01",
    "title": "There are some drawbacks of online shopping.",
    "center": "Online shopping",
    "branches": [
      {
        "num": 1,
        "text": "Delay in delivery",
        "pos": "top",
        "type": "noun",
        "vi": "Chậm trễ trong giao hàng"
      },
      {
        "num": 2,
        "text": "Lack of shopping experience",
        "pos": "right",
        "type": "noun",
        "vi": "Thiếu trải nghiệm thử đồ thực tế"
      },
      {
        "num": 3,
        "text": "Unexpected product quality",
        "pos": "bottom",
        "type": "noun",
        "vi": "Chất lượng không như mong đợi"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "How can consumers protect themselves when shopping online?",
        "vi": "Làm thế nào người mua tự bảo vệ mình?",
        "a": "Consumers should <strong>buy products from official and trusted stores</strong> on reputable websites. Furthermore, always <strong>read reviews and customer ratings carefully</strong> before making a purchase."
      },
      {
        "q": "Will online stores completely replace traditional shopping malls?",
        "vi": "Cửa hàng online có thay thế hoàn toàn trung tâm thương mại?",
        "a": "No, traditional malls will not disappear because people love <strong>trying on clothes in person and hanging out</strong> with friends. Real shopping gives an <strong>exciting social experience</strong> that screens cannot replace."
      },
      {
        "q": "What should you do if an online order arrives damaged?",
        "vi": "Nên làm gì khi hàng online bị hư hỏng?",
        "a": "You should <strong>take clear photos of the damaged package</strong> and notify the seller immediately. After that, you can <strong>request a replacement or a full refund</strong>."
      }
    ]
  },
  {
    "id": "d-topic-02",
    "category": "drawbacks",
    "categoryName": "Nhóm Bất Lợi",
    "topicCode": "ĐỀ SỐ 02",
    "title": "There are some disadvantages of public transport.",
    "center": "Public transport",
    "branches": [
      {
        "num": 1,
        "text": "Take a lot of time",
        "pos": "top",
        "type": "verb",
        "vi": "Mất nhiều thời gian chờ đợi"
      },
      {
        "num": 2,
        "text": "Be very crowded during rush hours",
        "pos": "right",
        "type": "verb",
        "vi": "Rất đông đúc vào giờ cao điểm"
      },
      {
        "num": 3,
        "text": "Risk of being victims of petty crimes",
        "pos": "bottom",
        "type": "noun",
        "vi": "Nguy cơ bị móc túi, mất đồ"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "How can governments encourage more people to ride buses and metros?",
        "vi": "Chính phủ khuyến khích đi xe bus thế nào?",
        "a": "Governments should <strong>offer cheaper monthly tickets</strong> and keep buses clean and air-conditioned. Moreover, <strong>adding more frequent departure routes</strong> will save passengers valuable time."
      },
      {
        "q": "Is public transport eco-friendly?",
        "vi": "Phương tiện công cộng có thân thiện môi trường không?",
        "a": "Yes, public transport is <strong>much more eco-friendly than private cars</strong> because buses carry many passengers at once. This helps <strong>reduce smoke emissions and traffic jams</strong> significantly."
      },
      {
        "q": "Do you prefer traveling by motorbike or by bus?",
        "vi": "Bạn thích đi xe máy hay xe buýt?",
        "a": "I prefer <strong>traveling by bus on rainy days</strong> because it is much safer and drier. However, on sunny days, <strong>riding a motorbike is quicker</strong> in narrow streets."
      }
    ]
  },
  {
    "id": "d-topic-03",
    "category": "drawbacks",
    "categoryName": "Nhóm Bất Lợi",
    "topicCode": "ĐỀ SỐ 03",
    "title": "Doing exercise also has some drawbacks.",
    "center": "Doing exercise",
    "branches": [
      {
        "num": 1,
        "text": "Waste time if not planned well",
        "pos": "top",
        "type": "verb",
        "vi": "Tốn thời gian nếu không sắp xếp tốt"
      },
      {
        "num": 2,
        "text": "Waste money on gym memberships",
        "pos": "right",
        "type": "verb",
        "vi": "Tốn chi phí tập luyện đắt đỏ"
      },
      {
        "num": 3,
        "text": "Risk of getting injured",
        "pos": "bottom",
        "type": "verb",
        "vi": "Nguy cơ chấn thương cơ bắp/khớp"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "How can people prevent sports injuries?",
        "vi": "Làm thế nào phòng tránh chấn thương thể thao?",
        "a": "People should <strong>warm up carefully for ten minutes</strong> before doing intense sports. In addition, <strong>wearing proper athletic shoes</strong> protects joints and muscles from sudden injuries."
      },
      {
        "q": "Is going to an expensive gym necessary to stay fit?",
        "vi": "Có cần đến phòng gym đắt tiền không?",
        "a": "No, an expensive gym is not necessary because people can <strong>jog in the local park or exercise at home</strong>. Doing simple push-ups and walking daily is <strong>more than enough to stay healthy</strong>."
      },
      {
        "q": "How many hours of exercise per week is enough for adults?",
        "vi": "Người lớn nên tập bao nhiêu giờ mỗi tuần?",
        "a": "Adults should exercise for <strong>about three to five hours per week</strong> to maintain fitness. Doing <strong>thirty minutes of moderate movement each day</strong> brings the best health results."
      }
    ]
  },
  {
    "id": "d-topic-04",
    "category": "drawbacks",
    "categoryName": "Nhóm Bất Lợi",
    "topicCode": "ĐỀ SỐ 04",
    "title": "There are some disadvantages of self-employment.",
    "center": "Self-employment",
    "branches": [
      {
        "num": 1,
        "text": "Financial burden and risks",
        "pos": "top",
        "type": "noun",
        "vi": "Gánh nặng và rủi ro tài chính"
      },
      {
        "num": 2,
        "text": "Lack of employment benefits",
        "pos": "right",
        "type": "noun",
        "vi": "Thiếu các chế độ bảo hiểm, đãi ngộ"
      },
      {
        "num": 3,
        "text": "Increased responsibility and long hours",
        "pos": "bottom",
        "type": "noun",
        "vi": "Trách nhiệm nặng nề & giờ làm dài"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "Do you think people should become self-employed despite these disadvantages?",
        "vi": "Có nên tự kinh doanh bất chấp bất lợi?",
        "a": "Yes, self-employment allows people to <strong>control their own working schedule</strong> and pursue their true passions. If they work hard and stay patient, they can <strong>achieve great financial freedom</strong>."
      },
      {
        "q": "Should students choose self-employment or work for a company after graduation?",
        "vi": "Sinh viên nên tự kinh doanh hay đi làm công ty?",
        "a": "Graduates should <strong>work for a company for a few years</strong> to gain practical experience and professional skills. After building a network, they can <strong>start their own business with lower risks</strong>."
      },
      {
        "q": "What skills are most important for self-employed entrepreneurs?",
        "vi": "Kỹ năng nào quan trọng nhất cho chủ kinh doanh?",
        "a": "The most important skills are <strong>strict self-discipline and financial management</strong>. Furthermore, having <strong>strong communication skills to attract customers</strong> is vital for long-term success."
      }
    ]
  },
  {
    "id": "d-topic-05",
    "category": "drawbacks",
    "categoryName": "Nhóm Bất Lợi",
    "topicCode": "ĐỀ SỐ 05",
    "title": "Living in an apartment has some disadvantages.",
    "center": "Living in an apartment",
    "branches": [
      {
        "num": 1,
        "text": "Pet restrictions",
        "pos": "top",
        "type": "noun",
        "vi": "Quy định cấm nuôi thú cưng"
      },
      {
        "num": 2,
        "text": "Limited private spaces",
        "pos": "right",
        "type": "noun",
        "vi": "Không gian sinh hoạt hạn chế"
      },
      {
        "num": 3,
        "text": "Noise from neighbors",
        "pos": "bottom",
        "type": "noun",
        "vi": "Tiếng ồn từ các căn hộ lân cận"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "Why do many young families still choose apartments?",
        "vi": "Tại sao nhiều gia đình trẻ vẫn chọn chung cư?",
        "a": "Young families choose apartments because of <strong>reasonable prices and modern building security</strong>. Besides, having <strong>elevators, playgrounds, and mini-marts right downstairs</strong> is extremely convenient."
      },
      {
        "q": "How can apartment residents deal with noisy neighbors?",
        "vi": "Xử lý hàng xóm ồn ào thế nào?",
        "a": "Residents should <strong>talk politely with their neighbors</strong> to ask for lower volume during late hours. If the problem continues, they can <strong>report it to the apartment management board</strong>."
      },
      {
        "q": "Do you prefer a townhouse or a condominium?",
        "vi": "Bạn thích nhà phố hay chung cư?",
        "a": "I prefer <strong>living in a condominium</strong> because it has 24/7 security guards and a quiet living environment. Living on higher floors also <strong>offers fresh air and avoids street dust</strong>."
      }
    ]
  },
  {
    "id": "d-topic-06",
    "category": "drawbacks",
    "categoryName": "Nhóm Bất Lợi",
    "topicCode": "ĐỀ SỐ 06",
    "title": "Artificial Intelligence has certain drawbacks.",
    "center": "Drawbacks of AI",
    "branches": [
      {
        "num": 1,
        "text": "Over-reliance on AI in daily life",
        "pos": "top",
        "type": "noun",
        "vi": "Lệ thuộc quá mức vào AI"
      },
      {
        "num": 2,
        "text": "Job loss due to automation",
        "pos": "right",
        "type": "noun",
        "vi": "Mất việc làm do tự động hóa"
      },
      {
        "num": 3,
        "text": "Risk of receiving false or biased information",
        "pos": "bottom",
        "type": "noun",
        "vi": "Nguy cơ tin giả và thông tin sai lệch"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "How can students avoid relying too much on AI?",
        "vi": "Học sinh tránh phụ thuộc AI thế nào?",
        "a": "Students should <strong>write their own ideas and drafts</strong> before using AI for quick reference. Moreover, teachers should <strong>ask students to give oral presentations</strong> in class."
      },
      {
        "q": "Can AI replace human creativity in art and writing?",
        "vi": "AI có thay thế được sáng tạo nghệ thuật?",
        "a": "No, AI cannot replace real human creativity because it lacks <strong>genuine emotions and personal life experience</strong>. True art comes from <strong>the soul and unique feelings of human beings</strong>."
      },
      {
        "q": "What should schools do about students using ChatGPT to do homework?",
        "vi": "Trường học nên làm gì khi học sinh dùng ChatGPT?",
        "a": "Schools should <strong>teach students how to use AI ethically</strong> as a research assistant. Additionally, teachers can <strong>assign in-class writing tests</strong> without internet access."
      }
    ]
  },
  {
    "id": "c-topic-01",
    "category": "causes",
    "categoryName": "Nhóm Nguyên Nhân / Lý Do",
    "topicCode": "ĐỀ SỐ 01",
    "title": "There are several causes of youth violence.",
    "center": "Youth violence",
    "branches": [
      {
        "num": 1,
        "text": "Get media influence",
        "pos": "top",
        "type": "verb",
        "vi": "Chịu ảnh hưởng phim ảnh, game bạo lực"
      },
      {
        "num": 2,
        "text": "Have peer pressure",
        "pos": "right",
        "type": "verb",
        "vi": "Chịu áp lực xấu từ bạn bè"
      },
      {
        "num": 3,
        "text": "Lack of parental supervision",
        "pos": "bottom",
        "type": "noun",
        "vi": "Thiếu sự quan tâm uốn nắn từ cha mẹ"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "How can schools help prevent school violence?",
        "vi": "Trường học làm gì để ngăn bạo lực học đường?",
        "a": "Schools should <strong>teach moral lessons about mutual respect</strong> and organize anti-bullying workshops. Furthermore, <strong>installing security cameras and strict rules</strong> will stop aggressive behavior."
      },
      {
        "q": "Is cyberbullying among youth becoming worse?",
        "vi": "Bạo lực mạng ở giới trẻ có đang tồi tệ hơn?",
        "a": "Yes, cyberbullying is becoming more serious because people can <strong>hide their identity behind computer screens</strong>. Hurtful comments on social media can <strong>cause deep depression among teenagers</strong>."
      },
      {
        "q": "What role do parents play in guiding aggressive teenagers?",
        "vi": "Vai trò của cha mẹ khi con cái bướng bỉnh?",
        "a": "Parents should <strong>spend time talking with their children daily</strong> and listen to their personal struggles. Providing <strong>warm emotional support at home</strong> prevents kids from becoming aggressive."
      }
    ]
  },
  {
    "id": "c-topic-02",
    "category": "causes",
    "categoryName": "Nhóm Nguyên Nhân / Lý Do",
    "topicCode": "ĐỀ SỐ 02",
    "title": "Parents are the best teachers.",
    "center": "Parents as teachers",
    "branches": [
      {
        "num": 1,
        "text": "Be closer to the children",
        "pos": "top",
        "type": "verb",
        "vi": "Gần gũi nhất với con cái"
      },
      {
        "num": 2,
        "text": "Teach them with love and responsibility",
        "pos": "right",
        "type": "verb",
        "vi": "Dạy dỗ bằng tình yêu và trách nhiệm"
      },
      {
        "num": 3,
        "text": "Understand their strengths and weaknesses",
        "pos": "bottom",
        "type": "verb",
        "vi": "Hiểu rõ điểm mạnh và điểm yếu của con"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "What values should parents teach children first?",
        "vi": "Cha mẹ nên dạy con giá trị nào đầu tiên?",
        "a": "Parents should teach children <strong>honesty, politeness, and respect for elders</strong> first. These basic moral values form <strong>the solid foundation of good character</strong>."
      },
      {
        "q": "Can parents sometimes teach their children bad habits?",
        "vi": "Cha mẹ có thể vô tình dạy con thói quen xấu?",
        "a": "Yes, if parents smoke, argue loudly, or spend too much time on phones, children will <strong>copy these negative habits easily</strong>. Therefore, parents must <strong>set a good personal example</strong>."
      },
      {
        "q": "Who has a stronger influence on teenagers: parents or teachers?",
        "vi": "Cha mẹ hay thầy cô có ảnh hưởng lớn hơn?",
        "a": "I think parents have a stronger influence because they <strong>live with teenagers and love them unconditionally</strong>. However, school teachers also play a big role in <strong>shaping career knowledge</strong>."
      }
    ]
  },
  {
    "id": "c-topic-03",
    "category": "causes",
    "categoryName": "Nhóm Nguyên Nhân / Lý Do",
    "topicCode": "ĐỀ SỐ 03",
    "title": "A lot of students have to suffer from school pressure.",
    "center": "School pressure",
    "branches": [
      {
        "num": 1,
        "text": "High parental expectations",
        "pos": "top",
        "type": "noun",
        "vi": "Kỳ vọng quá lớn từ cha mẹ"
      },
      {
        "num": 2,
        "text": "Peer competition",
        "pos": "right",
        "type": "noun",
        "vi": "Áp lực ganh đua điểm số từ bạn bè"
      },
      {
        "num": 3,
        "text": "Heavy academic workload",
        "pos": "bottom",
        "type": "noun",
        "vi": "Khối lượng bài vở, thi cử quá tải"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "How can schools reduce exam stress for pupils?",
        "vi": "Làm sao giảm áp lực thi cử cho học sinh?",
        "a": "Schools can <strong>reduce the amount of daily homework</strong> and replace heavy tests with practical group projects. This approach helps students <strong>learn with enjoyment instead of fear</strong>."
      },
      {
        "q": "What should parents do when their child gets low grades?",
        "vi": "Cha mẹ nên làm gì khi con bị điểm kém?",
        "a": "Parents should <strong>encourage their children and help them review mistakes</strong> calmly instead of shouting. Showing patience makes the child <strong>feel confident to try harder next time</strong>."
      },
      {
        "q": "Can physical sports relieve study stress?",
        "vi": "Thể thao có giúp giảm căng thẳng học tập?",
        "a": "Yes, playing sports helps students <strong>release pent-up stress and clear their minds</strong>. Physical exercise stimulates endorphins, making students <strong>feel happier and sleep much better</strong>."
      }
    ]
  },
  {
    "id": "c-topic-04",
    "category": "causes",
    "categoryName": "Nhóm Nguyên Nhân / Lý Do",
    "topicCode": "ĐỀ SỐ 04",
    "title": "Women are encouraged to become leaders.",
    "center": "Women leaders",
    "branches": [
      {
        "num": 1,
        "text": "Good communication skills",
        "pos": "top",
        "type": "noun",
        "vi": "Kỹ năng giao tiếp và đồng cảm tốt"
      },
      {
        "num": 2,
        "text": "Effective teamwork skills",
        "pos": "right",
        "type": "noun",
        "vi": "Khả năng làm việc nhóm hòa hợp"
      },
      {
        "num": 3,
        "text": "The ability to multitask",
        "pos": "bottom",
        "type": "noun",
        "vi": "Khả năng quán xuyến nhiều việc"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "Do men and women lead differently?",
        "vi": "Nam và nữ lãnh đạo có khác nhau?",
        "a": "Yes, women leaders often show <strong>greater empathy, active listening, and teamwork spirit</strong>. In contrast, men are sometimes <strong>more direct and decisive in taking risks</strong>."
      },
      {
        "q": "What is the biggest barrier for women aiming for executive roles?",
        "vi": "Rào cản lớn nhất của phụ nữ khi lên lãnh đạo?",
        "a": "The biggest barrier is <strong>balancing heavy household chores with demanding corporate duties</strong>. Traditional gender stereotypes also <strong>prevent women from getting senior promotions</strong>."
      },
      {
        "q": "How can companies foster gender equality?",
        "vi": "Doanh nghiệp thúc đẩy bình đẳng giới thế nào?",
        "a": "Companies should <strong>provide equal pay and equal promotion chances</strong> for both men and women. In addition, <strong>flexible maternity leave policies</strong> help working mothers stay employed."
      }
    ]
  },
  {
    "id": "c-topic-05",
    "category": "causes",
    "categoryName": "Nhóm Nguyên Nhân / Lý Do",
    "topicCode": "ĐỀ SỐ 05",
    "title": "There are some factors causing stress in modern life.",
    "center": "Causes of stress",
    "branches": [
      {
        "num": 1,
        "text": "Study or work burnout",
        "pos": "top",
        "type": "noun",
        "vi": "Áp lực kiệt sức vì công việc/học hành"
      },
      {
        "num": 2,
        "text": "Poor financial situation",
        "pos": "right",
        "type": "noun",
        "vi": "Khó khăn về tài chính, nợ nần"
      },
      {
        "num": 3,
        "text": "Relationship and marital problems",
        "pos": "bottom",
        "type": "noun",
        "vi": "Mâu thuẫn trong các mối quan hệ"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "What are early symptoms of chronic stress?",
        "vi": "Dấu hiệu sớm của stress mãn tính?",
        "a": "Early symptoms include <strong>chronic headaches, sudden anger, and insomnia</strong> at night. When stressed, people also <strong>lose their appetite and feel exhausted</strong> all day."
      },
      {
        "q": "Can talking to a friend relieve stress?",
        "vi": "Tâm sự với bạn bè có giảm stress?",
        "a": "Yes, talking with a close friend helps people <strong>release pent-up emotions and feel understood</strong>. Good friends can also <strong>give helpful advice to solve daily worries</strong>."
      },
      {
        "q": "When should someone seek professional therapy?",
        "vi": "Khi nào nên gặp chuyên gia tâm lý?",
        "a": "Someone should seek professional therapy when stress <strong>causes prolonged depression and stops normal daily work</strong>. Talking with a therapist provides <strong>safe treatments and scientific guidance</strong>."
      }
    ]
  },
  {
    "id": "c-topic-06",
    "category": "causes",
    "categoryName": "Nhóm Nguyên Nhân / Lý Do",
    "topicCode": "ĐỀ SỐ 06",
    "title": "Childhood obesity is caused by several factors.",
    "center": "Childhood obesity",
    "branches": [
      {
        "num": 1,
        "text": "Unhealthy fast-food eating habits",
        "pos": "top",
        "type": "noun",
        "vi": "Thói quen ăn thức ăn nhanh nhiều dầu mỡ"
      },
      {
        "num": 2,
        "text": "Excessive mobile phone and TV use",
        "pos": "right",
        "type": "noun",
        "vi": "Dùng điện thoại và xem TV quá nhiều"
      },
      {
        "num": 3,
        "text": "Lack of physical exercise and outdoor play",
        "pos": "bottom",
        "type": "noun",
        "vi": "Lười vận động và chơi ngoài trời"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "Should schools ban soft drinks and candy in canteens?",
        "vi": "Trường học có nên cấm nước ngọt ở căn tin?",
        "a": "Yes, school canteens should <strong>ban sugary soft drinks and deep-fried snacks</strong> completely. Instead, they should <strong>provide fresh fruits, clean milk, and vegetables</strong>."
      },
      {
        "q": "What health issues can obese children face later in life?",
        "vi": "Trẻ béo phì đối mặt nguy cơ gì sau này?",
        "a": "Obese children face high risks of <strong>diabetes, high blood pressure, and heart diseases</strong> as adults. Furthermore, they may <strong>feel low self-esteem due to teasing</strong>."
      },
      {
        "q": "How can families create an active lifestyle together?",
        "vi": "Gia đình làm sao để cùng nhau vận động?",
        "a": "Parents can <strong>take their kids cycling or swimming together</strong> every weekend. In addition, <strong>cooking fresh home-cooked meals</strong> prevents children from eating junk food."
      }
    ]
  },
  {
    "id": "q-topic-01",
    "category": "qualities",
    "categoryName": "Nhóm Đặc Điểm / Phẩm Chất",
    "topicCode": "ĐỀ SỐ 01",
    "title": "Equal partnership in a family has some features.",
    "center": "Equal partnership",
    "branches": [
      {
        "num": 1,
        "text": "Share routines and household tasks",
        "pos": "top",
        "type": "verb",
        "vi": "Chia sẻ việc nhà hàng ngày"
      },
      {
        "num": 2,
        "text": "Equal childcare responsibility",
        "pos": "right",
        "type": "noun",
        "vi": "Cùng chia sẻ việc nuôi dạy con"
      },
      {
        "num": 3,
        "text": "Work together as a supportive team",
        "pos": "bottom",
        "type": "verb",
        "vi": "Phối hợp hỗ trợ nhau như một đội"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "How have the roles of husband and wife changed in the past 10 years?",
        "vi": "Vai trò vợ chồng đã thay đổi thế nào?",
        "a": "In the past, husbands earned money while wives only did housework. Nowadays, both partners <strong>share financial responsibilities and household chores equally</strong>."
      },
      {
        "q": "What roles do grandparents play in a family?",
        "vi": "Vai trò của ông bà trong gia đình?",
        "a": "Grandparents provide <strong>unconditional love and help look after grandchildren</strong> when parents work. They also share <strong>valuable traditional wisdom and family values</strong>."
      },
      {
        "q": "What do you think about single-parent families?",
        "vi": "Bạn nghĩ gì về gia đình đơn thân?",
        "a": "Single parents are <strong>very admirable because they work double hard</strong> to raise their children alone. Society should <strong>offer them financial and emotional support</strong>."
      }
    ]
  },
  {
    "id": "q-topic-02",
    "category": "qualities",
    "categoryName": "Nhóm Đặc Điểm / Phẩm Chất",
    "topicCode": "ĐỀ SỐ 02",
    "title": "A good worker can adapt well to any working environment.",
    "center": "A good worker",
    "branches": [
      {
        "num": 1,
        "text": "High creativity",
        "pos": "top",
        "type": "noun",
        "vi": "Khả năng sáng tạo cao"
      },
      {
        "num": 2,
        "text": "Strong sense of responsibility",
        "pos": "right",
        "type": "noun",
        "vi": "Tinh thần trách nhiệm vững vàng"
      },
      {
        "num": 3,
        "text": "Possess diverse multidisciplinary skills",
        "pos": "bottom",
        "type": "verb",
        "vi": "Sở hữu đa dạng kỹ năng chuyên môn"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "Why is adaptability important in today's rapid job market?",
        "vi": "Tại sao khả năng thích nghi quan trọng?",
        "a": "Because business environments and technology <strong>change extremely fast with new tools</strong>. Adaptable workers can <strong>learn new skills quickly and keep their jobs</strong>."
      },
      {
        "q": "Can someone improve their problem-solving skills?",
        "vi": "Có thể cải thiện kỹ năng giải quyết vấn đề?",
        "a": "Yes, people can improve this skill by <strong>analyzing difficulties calmly and learning from mistakes</strong>. In addition, <strong>asking for advice from senior mentors</strong> is very effective."
      },
      {
        "q": "What is more valuable: technical skills or a positive work attitude?",
        "vi": "Kỹ năng chuyên môn hay thái độ tích cực quan trọng hơn?",
        "a": "In my view, a <strong>positive and hardworking attitude is more valuable</strong> because technical skills can be trained. An honest and enthusiastic employee will <strong>always be trusted by the manager</strong>."
      }
    ]
  },
  {
    "id": "q-topic-03",
    "category": "qualities",
    "categoryName": "Nhóm Đặc Điểm / Phẩm Chất",
    "topicCode": "ĐỀ SỐ 03",
    "title": "A friend in need is a friend indeed.",
    "center": "A good friend",
    "branches": [
      {
        "num": 1,
        "text": "Give helpful and honest advice",
        "pos": "top",
        "type": "verb",
        "vi": "Đưa ra lời khuyên chân thành"
      },
      {
        "num": 2,
        "text": "Listen empathetically and keep secrets",
        "pos": "right",
        "type": "verb",
        "vi": "Lắng nghe và giữ kín bí mật"
      },
      {
        "num": 3,
        "text": "Point out mistakes constructively",
        "pos": "bottom",
        "type": "verb",
        "vi": "Góp ý chân tình khi bạn sai"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "How can people maintain long-distance friendships?",
        "vi": "Duy trì tình bạn xa cách bằng cách nào?",
        "a": "Friends can <strong>send daily messages and video call each other</strong> regularly on weekends. Moreover, <strong>sending birthday gifts and planning visits</strong> keeps the friendship strong."
      },
      {
        "q": "Is having a few true friends better than having many acquaintances?",
        "vi": "Ít bạn thân tốt hơn nhiều bạn xã giao?",
        "a": "Yes, having two or three loyal friends is <strong>far better than hundreds of superficial acquaintances</strong>. True friends will <strong>stand by you when you face difficulties</strong> in life."
      },
      {
        "q": "What should you do if a friend betrays your trust?",
        "vi": "Nên làm gì khi bạn bè phản bội lòng tin?",
        "a": "First, you should <strong>talk directly to understand the real situation</strong>. If that person does not feel sorry or change, it is best to <strong>keep a safe distance from them</strong>."
      }
    ]
  },
  {
    "id": "q-topic-04",
    "category": "qualities",
    "categoryName": "Nhóm Đặc Điểm / Phẩm Chất",
    "topicCode": "ĐỀ SỐ 04",
    "title": "A good team leader has some clear qualities.",
    "center": "A team leader",
    "branches": [
      {
        "num": 1,
        "text": "High responsibility",
        "pos": "top",
        "type": "noun",
        "vi": "Trách nhiệm cao"
      },
      {
        "num": 2,
        "text": "Good communication skills",
        "pos": "right",
        "type": "noun",
        "vi": "Kỹ năng giao tiếp xuất sắc"
      },
      {
        "num": 3,
        "text": "Be supportive and encouraging",
        "pos": "bottom",
        "type": "verb",
        "vi": "Luôn hỗ trợ và khích lệ cấp dưới"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "Can leadership be taught, or is it inborn?",
        "vi": "Lãnh đạo là bẩm sinh hay do học tập?",
        "a": "I believe leadership skills can be <strong>learned through practice and proper training</strong>. Although some people are naturally charismatic, <strong>anyone can become a leader with dedication</strong>."
      },
      {
        "q": "How should a leader handle team conflicts?",
        "vi": "Lãnh đạo nên xử lý mâu thuẫn nhóm thế nào?",
        "a": "A leader should <strong>listen to both sides calmly and impartially</strong>. Then, they should <strong>guide team members to find a fair compromise</strong> that everyone accepts."
      },
      {
        "q": "What is the difference between a boss and a true leader?",
        "vi": "Khác biệt giữa một ông chủ và người lãnh đạo?",
        "a": "A boss simply <strong>gives strict orders and demands results</strong> from employees. In contrast, a true leader <strong>inspires the team and works alongside them</strong>."
      }
    ]
  },
  {
    "id": "q-topic-05",
    "category": "qualities",
    "categoryName": "Nhóm Đặc Điểm / Phẩm Chất",
    "topicCode": "ĐỀ SỐ 05",
    "title": "A great teacher can inspire and support students in many ways.",
    "center": "A great teacher",
    "branches": [
      {
        "num": 1,
        "text": "Be creative in lesson delivery",
        "pos": "top",
        "type": "verb",
        "vi": "Sáng tạo trong phương pháp giảng dạy"
      },
      {
        "num": 2,
        "text": "Be knowledgeable and up-to-date",
        "pos": "right",
        "type": "verb",
        "vi": "Kiến thức sâu rộng và cập nhật"
      },
      {
        "num": 3,
        "text": "Be patient and caring with all students",
        "pos": "bottom",
        "type": "verb",
        "vi": "Kiên nhẫn và tận tụy với học trò"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "Who was your favorite teacher and why?",
        "vi": "Ai là giáo viên yêu thích nhất của bạn?",
        "a": "My favorite teacher was my high school English teacher because she was <strong>very patient, caring, and encouraging</strong>. She always <strong>made complex lessons easy and fun to understand</strong>."
      },
      {
        "q": "Will computers ever replace human teachers?",
        "vi": "Máy tính có thể thay thế giáo viên?",
        "a": "No, computers will never replace teachers because machines cannot <strong>show real human empathy and personal encouragement</strong>. A caring teacher <strong>inspires moral values and character</strong>."
      },
      {
        "q": "What is the hardest challenge modern teachers face?",
        "vi": "Thử thách lớn nhất của giáo viên hiện nay?",
        "a": "The hardest challenge is <strong>dealing with students who are distracted by smartphones</strong> in class. Teachers also have to <strong>manage heavy administrative paperwork</strong> every day."
      }
    ]
  },
  {
    "id": "q-topic-06",
    "category": "qualities",
    "categoryName": "Nhóm Đặc Điểm / Phẩm Chất",
    "topicCode": "ĐỀ SỐ 06",
    "title": "A good student shows certain important qualities.",
    "center": "A good student",
    "branches": [
      {
        "num": 1,
        "text": "Self-discipline",
        "pos": "top",
        "type": "noun",
        "vi": "Tính kỷ luật tự giác"
      },
      {
        "num": 2,
        "text": "Eagerness to learn new knowledge",
        "pos": "right",
        "type": "noun",
        "vi": "Tinh thần ham học hỏi"
      },
      {
        "num": 3,
        "text": "Ability to manage study time well",
        "pos": "bottom",
        "type": "noun",
        "vi": "Khả năng sắp xếp thời gian hợp lý"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "Why is self-discipline the most crucial quality for students today?",
        "vi": "Tại sao tính tự giác là quan trọng nhất?",
        "a": "Self-discipline is crucial because students face <strong>countless online distractions like social media and video games</strong>. With discipline, they can <strong>finish homework on time and study consistently</strong>."
      },
      {
        "q": "Which is more important: high test scores or good character?",
        "vi": "Điểm số cao hay phẩm chất tốt quan trọng hơn?",
        "a": "Good character is far more important because <strong>high scores without honesty cannot make a good citizen</strong>. A person with integrity will <strong>earn respect and succeed in the long run</strong>."
      },
      {
        "q": "How can students improve their time management?",
        "vi": "Học sinh cải thiện quản lý thời gian thế nào?",
        "a": "Students should <strong>write down daily tasks in a study notebook</strong> and set realistic deadlines. Additionally, <strong>turning off phone notifications while studying</strong> helps them concentrate."
      }
    ]
  },
  {
    "id": "w-topic-01",
    "category": "ways",
    "categoryName": "Nhóm Cách Thức / Phương Pháp",
    "topicCode": "ĐỀ SỐ 01",
    "title": "There are several ways to overcome sadness.",
    "center": "Overcome sadness",
    "branches": [
      {
        "num": 1,
        "text": "Share thoughts with someone close",
        "pos": "top",
        "type": "verb",
        "vi": "Tâm sự với người thân/bạn bè"
      },
      {
        "num": 2,
        "text": "Listen to soothing or favorite music",
        "pos": "right",
        "type": "verb",
        "vi": "Nghe nhạc thư giãn"
      },
      {
        "num": 3,
        "text": "Do physical exercise regularly",
        "pos": "bottom",
        "type": "verb",
        "vi": "Tập thể dục giải phóng năng lượng"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "Is crying a healthy way to release negative emotions?",
        "vi": "Khóc có phải là cách lành mạnh giải tỏa cảm xúc?",
        "a": "Yes, crying is <strong>a natural and healthy way to release emotional pain</strong>. After crying, the body releases tension and the heart <strong>feels noticeably lighter and calmer</strong>."
      },
      {
        "q": "What should you do when a friend feels deeply sad?",
        "vi": "Nên làm gì khi bạn bè buồn bã?",
        "a": "You should <strong>sit beside them, listen attentively</strong>, and say comforting words. Furthermore, <strong>taking them out for a warm meal or walk</strong> helps cheer them up."
      },
      {
        "q": "Can spending time in nature improve mental health?",
        "vi": "Hòa mình vào thiên nhiên có cải thiện tâm trạng?",
        "a": "Yes, spending time in green parks helps <strong>lower stress hormones and refresh the mind</strong>. Breathing fresh air makes people <strong>feel peaceful and physically revitalized</strong>."
      }
    ]
  },
  {
    "id": "w-topic-02",
    "category": "ways",
    "categoryName": "Nhóm Cách Thức / Phương Pháp",
    "topicCode": "ĐỀ SỐ 02",
    "title": "There are ways to maintain good workplace relationships.",
    "center": "Workplace relationships",
    "branches": [
      {
        "num": 1,
        "text": "Build effective communication skills",
        "pos": "top",
        "type": "verb",
        "vi": "Rèn luyện giao tiếp cởi mở, chân thành"
      },
      {
        "num": 2,
        "text": "Keep good co-operation and mutual support",
        "pos": "right",
        "type": "verb",
        "vi": "Hợp tác và hỗ trợ đồng nghiệp"
      },
      {
        "num": 3,
        "text": "Avoid destructive criticism and office gossip",
        "pos": "bottom",
        "type": "verb",
        "vi": "Tránh bàn tán sau lưng và chỉ trích xấu"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "Why is office gossip harmful to a team?",
        "vi": "Tại sao tin đồn công sở gây hại?",
        "a": "Office gossip is very harmful because it <strong>damages trust and hurts people's reputations</strong>. It creates a <strong>toxic working atmosphere and destroys team harmony</strong>."
      },
      {
        "q": "How can introverted workers build rapport with team members?",
        "vi": "Người hướng nội kết nối với đồng nghiệp thế nào?",
        "a": "Introverted workers can <strong>smile and have short friendly chats</strong> during lunch breaks. Moreover, <strong>offering small help on daily tasks</strong> shows kindness and builds rapport naturally."
      },
      {
        "q": "Should managers socialize with employees after work?",
        "vi": "Sếp có nên đi chơi với nhân viên sau giờ làm?",
        "a": "Yes, occasional team dinners after work can <strong>help managers and staff understand each other better</strong>. However, managers should <strong>maintain professional boundaries</strong> during working hours."
      }
    ]
  },
  {
    "id": "w-topic-03",
    "category": "ways",
    "categoryName": "Nhóm Cách Thức / Phương Pháp",
    "topicCode": "ĐỀ SỐ 03",
    "title": "People should do a few things to have a successful interview.",
    "center": "A successful interview",
    "branches": [
      {
        "num": 1,
        "text": "Being punctual",
        "pos": "top",
        "type": "adj",
        "vi": "Đến đúng giờ"
      },
      {
        "num": 2,
        "text": "Being well-dressed and professional",
        "pos": "right",
        "type": "adj",
        "vi": "Ăn mặc lịch sự, chỉn chu"
      },
      {
        "num": 3,
        "text": "Being humorous and confident",
        "pos": "bottom",
        "type": "adj",
        "vi": "Tự tin, thân thiện, trả lời khéo léo"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "What question should an applicant ask the interviewer at the end?",
        "vi": "Ứng viên nên hỏi gì ở cuối buổi phỏng vấn?",
        "a": "An applicant can ask about <strong>daily work duties and future training programs</strong> at the company. This smart question shows that they are <strong>truly eager to learn and contribute</strong>."
      },
      {
        "q": "How can candidates calm interview nerves?",
        "vi": "Làm sao giữ bình tĩnh trước phỏng vấn?",
        "a": "Candidates should <strong>take deep slow breaths and practice common questions</strong> at home. Furthermore, <strong>arriving fifteen minutes early</strong> gives them time to feel calm and ready."
      },
      {
        "q": "Is sending a thank-you email after the interview recommended?",
        "vi": "Có nên gửi email cảm ơn sau phỏng vấn?",
        "a": "Yes, sending a brief thank-you email <strong>shows professionalism and polite manners</strong>. It also reminds the employer of your <strong>strong enthusiasm for the job position</strong>."
      }
    ]
  },
  {
    "id": "w-topic-04",
    "category": "ways",
    "categoryName": "Nhóm Cách Thức / Phương Pháp",
    "topicCode": "ĐỀ SỐ 04",
    "title": "There are some simple ways to stay healthy.",
    "center": "Stay healthy",
    "branches": [
      {
        "num": 1,
        "text": "Do physical exercise regularly",
        "pos": "top",
        "type": "verb",
        "vi": "Tập thể dục đều đặn"
      },
      {
        "num": 2,
        "text": "Manage stress effectively",
        "pos": "right",
        "type": "verb",
        "vi": "Kiểm soát căng thẳng tinh thần"
      },
      {
        "num": 3,
        "text": "Eat healthy food and drink plenty of water",
        "pos": "bottom",
        "type": "verb",
        "vi": "Ăn uống lành mạnh, đủ chất"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "Why is drinking enough water every day essential?",
        "vi": "Tại sao uống đủ nước rất quan trọng?",
        "a": "Drinking enough water is essential because it <strong>helps filter toxins and keeps the skin hydrated</strong>. It also prevents <strong>fatigue and supports healthy body digestion</strong>."
      },
      {
        "q": "How many hours of sleep do adults need per night?",
        "vi": "Người lớn cần ngủ bao nhiêu tiếng mỗi đêm?",
        "a": "Adults usually need <strong>about seven to eight hours of sound sleep</strong> every night. Sleeping enough allows the body to <strong>recover energy and keeps the brain sharp</strong>."
      },
      {
        "q": "Is mental health as important as physical health?",
        "vi": "Sức khỏe tinh thần có quan trọng như thể chất?",
        "a": "Yes, mental health is <strong>just as important as physical fitness</strong> for overall well-being. A peaceful and happy mind <strong>boosts the immune system and prevents illnesses</strong>."
      }
    ]
  },
  {
    "id": "w-topic-05",
    "category": "ways",
    "categoryName": "Nhóm Cách Thức / Phương Pháp",
    "topicCode": "ĐỀ SỐ 05",
    "title": "There are effective ways to manage stress in daily life.",
    "center": "Manage stress",
    "branches": [
      {
        "num": 1,
        "text": "Do physical exercise",
        "pos": "top",
        "type": "verb",
        "vi": "Tập luyện thể thao"
      },
      {
        "num": 2,
        "text": "Talk to someone you trust",
        "pos": "right",
        "type": "verb",
        "vi": "Tâm sự với người tin cậy"
      },
      {
        "num": 3,
        "text": "Take a short break and relax",
        "pos": "bottom",
        "type": "verb",
        "vi": "Nghỉ ngơi ngắn giữa giờ"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "Does meditation help reduce anxiety?",
        "vi": "Thiền có giúp giảm lo âu không?",
        "a": "Yes, mindfulness meditation helps <strong>calm racing thoughts and relaxes the whole nervous system</strong>. Practicing it for ten minutes daily <strong>brings peace and emotional balance</strong>."
      },
      {
        "q": "Can listening to instrumental music help people relax?",
        "vi": "Nhạc không lời có giúp thư giãn?",
        "a": "Listening to gentle classical music or nature sounds <strong>lowers heart rate and blood pressure</strong> effectively. It creates a <strong>soothing atmosphere that relieves daily mental fatigue</strong>."
      },
      {
        "q": "Why is taking short breaks during work crucial?",
        "vi": "Tại sao nghỉ giải lao ngắn là cần thiết?",
        "a": "Taking short breaks allows the brain to <strong>rest and regain sharp concentration</strong> quickly. It prevents <strong>work burnout and keeps productivity high</strong> throughout the day."
      }
    ]
  },
  {
    "id": "w-topic-06",
    "category": "ways",
    "categoryName": "Nhóm Cách Thức / Phương Pháp",
    "topicCode": "ĐỀ SỐ 06",
    "title": "There are some good ways to save money as a student.",
    "center": "Save money",
    "branches": [
      {
        "num": 1,
        "text": "Prepare meals at home",
        "pos": "top",
        "type": "verb",
        "vi": "Nấu ăn tại nhà"
      },
      {
        "num": 2,
        "text": "Avoid unnecessary shopping",
        "pos": "right",
        "type": "verb",
        "vi": "Tránh mua sắm hoang phí"
      },
      {
        "num": 3,
        "text": "Set a monthly budget",
        "pos": "bottom",
        "type": "verb",
        "vi": "Lập ngân sách chi tiêu hàng tháng"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "Why do students struggle to save money?",
        "vi": "Tại sao sinh viên khó tiết kiệm tiền?",
        "a": "Students struggle to save because of <strong>frequent eating out with friends and impulsive shopping</strong>. Without tracking small daily expenses, money <strong>disappears very quickly each month</strong>."
      },
      {
        "q": "Should students buy second-hand textbooks?",
        "vi": "Sinh viên có nên mua giáo trình cũ?",
        "a": "Yes, buying used textbooks helps students <strong>save a large amount of money each semester</strong>. Most second-hand books are <strong>still in good shape and have helpful notes</strong>."
      },
      {
        "q": "How can student discounts help with monthly budgets?",
        "vi": "Ưu đãi sinh viên giúp gì cho ngân sách?",
        "a": "Student discounts offer <strong>cheaper bus fares, cinema tickets, and software subscriptions</strong>. Taking advantage of these deals <strong>cuts monthly living costs noticeably</strong>."
      }
    ]
  },
  {
    "id": "w-topic-07",
    "category": "ways",
    "categoryName": "Nhóm Cách Thức / Phương Pháp",
    "topicCode": "ĐỀ SỐ 07",
    "title": "There are different ways to improve the school library.",
    "center": "Improve the school library",
    "branches": [
      {
        "num": 1,
        "text": "Add more useful books and reference resources",
        "pos": "top",
        "type": "verb",
        "vi": "Bổ sung nhiều sách và tài liệu hữu ích"
      },
      {
        "num": 2,
        "text": "Provide digital materials and modern computers",
        "pos": "right",
        "type": "verb",
        "vi": "Cung cấp tài liệu số và máy tính tra cứu"
      },
      {
        "num": 3,
        "text": "Create a more comfortable, quiet reading space",
        "pos": "bottom",
        "type": "verb",
        "vi": "Tạo không gian đọc yên tĩnh, thoải mái"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "How can libraries attract more students to visit?",
        "vi": "Thư viện làm gì để thu hút học sinh?",
        "a": "Libraries should <strong>provide comfortable study seats, fast Wi-Fi</strong>, and lots of modern books. Creating a <strong>quiet reading environment with natural light</strong> also attracts students."
      },
      {
        "q": "Are physical libraries still needed in the internet age?",
        "vi": "Thời đại internet có còn cần thư viện?",
        "a": "Yes, physical libraries are still necessary because they <strong>offer a quiet and focused atmosphere</strong> that homes lack. Being around studious peers <strong>motivates students to read more</strong>."
      },
      {
        "q": "Should food and drinks be allowed in school libraries?",
        "vi": "Có nên cho phép đồ ăn trong thư viện?",
        "a": "No, food and sugary drinks should be banned to <strong>keep books clean and avoid spilling on computers</strong>. However, having a <strong>small coffee corner outside the reading room</strong> is a great idea."
      }
    ]
  },
  {
    "id": "w-topic-08",
    "category": "ways",
    "categoryName": "Nhóm Cách Thức / Phương Pháp",
    "topicCode": "ĐỀ SỐ 08",
    "title": "There are different ways to learn history effectively.",
    "center": "Learn history",
    "branches": [
      {
        "num": 1,
        "text": "Reading more history books",
        "pos": "top",
        "type": "verb",
        "vi": "Đọc thêm sách lịch sử đa dạng"
      },
      {
        "num": 2,
        "text": "Listen to historical stories and podcasts",
        "pos": "right",
        "type": "verb",
        "vi": "Nghe kể chuyện lịch sử & podcast"
      },
      {
        "num": 3,
        "text": "Watch historical documentaries or films",
        "pos": "bottom",
        "type": "verb",
        "vi": "Xem phim tài liệu & phim lịch sử"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "Why do some students find history boring?",
        "vi": "Tại sao vài học sinh thấy lịch sử nhàm chán?",
        "a": "Students find it boring when they only <strong>memorize dry numbers and long lists of dates</strong> for tests. When history is taught without stories, it <strong>loses all its excitement and meaning</strong>."
      },
      {
        "q": "How can visiting museums make history more exciting?",
        "vi": "Tham quan bảo tàng giúp học lịch sử thế nào?",
        "a": "Museums display <strong>real ancient weapons, traditional clothing, and historical films</strong>. Seeing real objects helps students <strong>visualize historical events much better</strong> than books."
      },
      {
        "q": "Why is learning history important for every citizen?",
        "vi": "Tại sao học lịch sử quan trọng với mọi công dân?",
        "a": "Learning history helps citizens <strong>understand national traditions and take pride in their roots</strong>. It also teaches <strong>valuable lessons from the past to build a better future</strong>."
      }
    ]
  },
  {
    "id": "w-topic-09",
    "category": "ways",
    "categoryName": "Nhóm Cách Thức / Phương Pháp",
    "topicCode": "ĐỀ SỐ 09",
    "title": "People use different ways to keep in touch with others.",
    "center": "Keep in touch",
    "branches": [
      {
        "num": 1,
        "text": "Make phone and video calls",
        "pos": "top",
        "type": "verb",
        "vi": "Gọi điện thoại và gọi video"
      },
      {
        "num": 2,
        "text": "Meet in person for coffee or meals",
        "pos": "right",
        "type": "verb",
        "vi": "Gặp mặt trực tiếp ăn uống, trò chuyện"
      },
      {
        "num": 3,
        "text": "Send instant messages and emails",
        "pos": "bottom",
        "type": "verb",
        "vi": "Nhắn tin qua ứng dụng & mạng xã hội"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "How has social media changed how we stay in touch?",
        "vi": "Mạng xã hội đã thay đổi cách giữ liên lạc thế nào?",
        "a": "Social media allows people to <strong>send free instant messages and video call friends anytime</strong>. It makes staying in touch <strong>extremely easy, even across different countries</strong>."
      },
      {
        "q": "Do you prefer calling or texting?",
        "vi": "Bạn thích gọi điện hay nhắn tin?",
        "a": "I prefer <strong>texting for daily casual chats</strong> because it is quiet and convenient. However, for urgent matters, <strong>making a phone call is much clearer and faster</strong>."
      },
      {
        "q": "Why is face-to-face communication still the best?",
        "vi": "Tại sao gặp mặt trực tiếp vẫn là tốt nhất?",
        "a": "Face-to-face talk is best because you can <strong>see real facial expressions and hear vocal tones</strong>. Meeting in person builds <strong>deep emotional connection and genuine trust</strong>."
      }
    ]
  },
  {
    "id": "f-topic-01",
    "category": "factors",
    "categoryName": "Nhóm Yếu Tố",
    "topicCode": "ĐỀ SỐ 01",
    "title": "There are several factors to consider when applying for a job.",
    "center": "Applying for a job",
    "branches": [
      {
        "num": 1,
        "text": "Salary and bonuses",
        "pos": "top",
        "type": "noun",
        "vi": "Mức lương và chế độ thưởng"
      },
      {
        "num": 2,
        "text": "Workplace location",
        "pos": "right",
        "type": "noun",
        "vi": "Địa điểm làm việc & khoảng cách"
      },
      {
        "num": 3,
        "text": "Friendly working environment",
        "pos": "bottom",
        "type": "noun",
        "vi": "Môi trường làm việc & đồng nghiệp"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "Which factor do you think is the most important?",
        "vi": "Yếu tố nào quan trọng nhất?",
        "a": "In my view, <strong>career growth and learning opportunities</strong> are the most important factors. A good job should help you <strong>develop professional skills and advance higher</strong>."
      },
      {
        "q": "Do young people and older people look for the same thing in a job?",
        "vi": "Người trẻ và lớn tuổi có tìm kiếm điều giống nhau?",
        "a": "Young people often look for <strong>high promotion chances and creative working environments</strong>. In contrast, older workers value <strong>job stability and comprehensive health insurance</strong>."
      },
      {
        "q": "How can people find a job that is suitable for them?",
        "vi": "Làm thế nào để tìm được công việc phù hợp?",
        "a": "Job seekers should <strong>identify their personal strengths and passions</strong> before applying. Additionally, <strong>researching trustworthy recruitment websites and attending job fairs</strong> is very helpful."
      }
    ]
  },
  {
    "id": "f-topic-02",
    "category": "factors",
    "categoryName": "Nhóm Yếu Tố",
    "topicCode": "ĐỀ SỐ 02",
    "title": "There are several factors to consider in order to make a good impression in an interview.",
    "center": "Impression in interview",
    "branches": [
      {
        "num": 1,
        "text": "Professional appearance and attire",
        "pos": "top",
        "type": "noun",
        "vi": "Trang phục và ngoại hình chuyên nghiệp"
      },
      {
        "num": 2,
        "text": "Punctuality",
        "pos": "right",
        "type": "noun",
        "vi": "Sự đúng giờ"
      },
      {
        "num": 3,
        "text": "Clear and confident communication",
        "pos": "bottom",
        "type": "noun",
        "vi": "Giao tiếp rõ ràng, tự tin"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "Which factor is the most important in a job interview?",
        "vi": "Yếu tố nào quan trọng nhất trong phỏng vấn?",
        "a": "In my opinion, <strong>confident communication and thorough company research</strong> are most important. When you show knowledge about the company, the interviewer <strong>sees your genuine enthusiasm</strong>."
      },
      {
        "q": "Do you think first impressions are always accurate? Why or why not?",
        "vi": "Ấn tượng ban đầu có luôn chính xác không?",
        "a": "No, first impressions are not always accurate because candidates are often <strong>very nervous during the first few minutes</strong>. Interviewers need <strong>more conversation to evaluate true ability</strong>."
      },
      {
        "q": "What can people do if they make a bad first impression in an interview?",
        "vi": "Làm gì nếu lỡ tạo ấn tượng xấu ban đầu?",
        "a": "Candidates should <strong>stay calm, smile politely</strong>, and answer the remaining questions with clear examples. Showing honesty and composure helps <strong>recover the interviewer's confidence</strong>."
      }
    ]
  },
  {
    "id": "f-topic-03",
    "category": "factors",
    "categoryName": "Nhóm Yếu Tố",
    "topicCode": "BÀI MẪU",
    "title": "There are several factors to consider when choosing a university.",
    "center": "Choosing a university",
    "branches": [
      {
        "num": 1,
        "text": "Tuition fees",
        "pos": "top",
        "type": "noun",
        "vi": "Học phí & chi phí đào tạo"
      },
      {
        "num": 2,
        "text": "Academic reputation",
        "pos": "right",
        "type": "noun",
        "vi": "Danh tiếng & chất lượng đào tạo"
      },
      {
        "num": 3,
        "text": "Career prospects",
        "pos": "bottom",
        "type": "noun",
        "vi": "Cơ hội việc làm sau tốt nghiệp"
      },
      {
        "num": 4,
        "text": "[Your own idea]",
        "pos": "left",
        "type": "free",
        "vi": "Ý kiến riêng của bạn"
      }
    ],
    "followups": [
      {
        "q": "Which factor do you think is the most important when choosing a university?",
        "vi": "Bạn nghĩ yếu tố nào là quan trọng nhất khi chọn trường đại học?",
        "a": "In my opinion, <strong>high teaching quality and job opportunities after graduation</strong> are most important. A reputable university helps students <strong>secure high-paying employment easily</strong>."
      },
      {
        "q": "Should high school students follow their parents' advice when selecting a college?",
        "vi": "Học sinh có nên nghe theo lời khuyên của cha mẹ khi chọn trường không?",
        "a": "Yes, students should <strong>listen to their parents' valuable life experience</strong> for guidance. However, the final choice should <strong>suit the student's personal interests and strengths</strong>."
      },
      {
        "q": "Is graduating from a prestigious university the only way to achieve career success?",
        "vi": "Tốt nghiệp trường danh tiếng có phải là cách duy nhất để thành công trong sự nghiệp?",
        "a": "No, graduating from a top school is helpful, but <strong>practical skills and hard work matter more</strong>. Many self-taught individuals achieve great success through <strong>continuous dedication and passion</strong>."
      }
    ]
  }
];


// Linking Flashcards Pool
const FLASHCARDS_DATA = [
    { cat: 'Mở bài B2', front: 'There are some benefits of [topic].', back: 'Có một số lợi ích của... (Mở bài dạng Lợi ích)', ex: 'There are some benefits of teamwork in modern workplaces.' },
    { cat: 'Mở bài B2', front: 'There are some drawbacks of [topic].', back: 'Có một số nhược điểm/bất lợi của... (Mở bài dạng Bất lợi)', ex: 'There are some drawbacks of living in big cities.' },
    { cat: 'Mở bài B2', front: 'There are several causes of [topic].', back: 'Có một số nguyên nhân dẫn đến... (Mở bài dạng Nguyên nhân)', ex: 'There are several causes of youth violence.' },
    { cat: 'Mở bài B2', front: 'There are some reasons why [S+V]...', back: 'Có một số lý do tại sao... (Mở bài dạng Lý do)', ex: 'There are some reasons why women are encouraged to become leaders.' },
    { cat: 'Mở bài B2', front: 'There are some ways for [O] to [V]...', back: 'Có một số cách để [ai đó] [làm gì] (Mở bài dạng Cách thức)', ex: 'There are some ways for students to save money.' },
    { cat: 'Mở bài B2', front: 'There are several factors to consider when...', back: 'Có một số yếu tố cần cân nhắc khi... (Mở bài dạng Yếu tố)', ex: 'There are several factors to consider when applying for a job.' },
    { cat: 'Thân bài - Nhánh 1', front: 'One major advantage / factor is that...', back: 'Một ưu điểm / yếu tố lớn là...', ex: 'One major advantage is that digital learning is flexible.' },
    { cat: 'Thân bài - Nhánh 1', front: 'One effective measure is to [verb]...', back: 'Một biện pháp hiệu quả là...', ex: 'One effective measure is to prepare meals at home.' },
    { cat: 'Thân bài - Nhánh 1', front: 'One major essential trait is that...', back: 'Một phẩm chất cốt lõi là...', ex: 'One major essential trait is that a good student has self-discipline.' },
    { cat: 'Thân bài - Nhánh 2', front: 'Another positive aspect / reason is that...', back: 'Một khía cạnh tích cực / lý do khác là...', ex: 'Another positive aspect is that e-learning is time-saving.' },
    { cat: 'Thân bài - Nhánh 2', front: 'Another practical method is to [verb]...', back: 'Một phương pháp thực tế khác là...', ex: 'Another practical method is to avoid unnecessary shopping.' },
    { cat: 'Thân bài - Nhánh 2', front: 'Another important personal attribute is that...', back: 'Một đặc điểm cá nhân quan trọng khác là...', ex: 'Another important personal attribute is that a good student is eager to learn.' },
    { cat: 'Thân bài - Nhánh 3', front: 'One more beneficial effect / key element is that...', back: 'Thêm một tác động có lợi / yếu tố then chốt nữa là...', ex: 'One more beneficial effect is that distance learning is money-saving.' },
    { cat: 'Thân bài - Nhánh 3', front: 'One more useful approach is to [verb]...', back: 'Thêm một cách tiếp cận hữu ích nữa là...', ex: 'One more useful approach is to set a monthly budget.' },
    { cat: 'Thân bài - Nhánh 3', front: 'One more key strength is that...', back: 'Thêm một điểm mạnh then chốt nữa là...', ex: 'One more key strength is that a good student can manage time well.' },
    { cat: 'Mở rộng B2', front: '..., which is especially useful for...', back: 'Mệnh đề quan hệ giải thích lý do hoặc đối tượng hưởng lợi', ex: 'Students can study anytime, which is especially useful for those with busy schedules.' },
    { cat: 'Mở rộng B2', front: 'In fact, / To be specific, ...', back: 'Thực tế là / Cụ thể hơn là... (Dẫn dắt mở rộng ý)', ex: 'In fact, arriving on time shows that candidates are responsible.' },
    { cat: 'Mở rộng B2', front: 'Consequently, / As a result, ...', back: 'Hậu quả là / Kết quả là... (Chỉ kết quả)', ex: 'As a result, they can balance their studies with other responsibilities.' },
    { cat: 'Kết bài B2', front: 'In short, [topic] has several clear benefits, as mentioned above.', back: 'Tóm lại, [chủ đề] có những lợi ích rõ ràng như đã nêu.', ex: 'In short, online learning has several clear benefits, as mentioned above.' },
    { cat: 'Follow-ups B2', front: 'From my perspective, ... / In my viewpoint, ...', back: 'Theo quan điểm của tôi... (Bắt đầu trả lời câu hỏi mở rộng)', ex: 'From my perspective, self-discipline is the most critical quality.' },
    { cat: 'Follow-ups B2', front: 'There are two main reasons for this. Firstly, ...', back: 'Có hai lý do chính cho điều này. Thứ nhất là...', ex: 'There are two main reasons for this. Firstly, it reduces unexpected costs.' }
];

// App State
const state = {
    student: {
        name: localStorage.getItem('vstep_sp3_b2_name') || '',
        classCode: localStorage.getItem('vstep_sp3_b2_class') || ''
    },
    theme: localStorage.getItem('vstep_sp3_theme') || 'light',
    audioEnabled: true,
    speechRate: 1.0,
    selectedVoiceURI: null,
    currentSimTopic: ALL_TOPICS_POOL[0],
    simTimer: {
        phase: 'ready',
        timeLeft: 60,
        totalTime: 60,
        interval: null,
        isPaused: false
    },
    audioRecorder: {
        mediaRecorder: null,
        audioChunks: [],
        audioBlob: null,
        audioUrl: null
    },
    cardIndex: 0
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initTheme();
    initVoices();
    initNavigation();
    initExamSimulator();
    initFlashcards();
    renderAllMindmaps();
});

// Danh sách học viên các lớp được cấp quyền truy cập
const CLASS_STUDENTS = {
    "B212": [
        "Nguyễn Duy Hồng Anh",
        "Nguyễn Ngọc Minh Anh",
        "Nguyễn Lê Mỹ Hân",
        "Nguyễn Hồng Minh Huy",
        "Nguyễn Quốc Khải",
        "Đoàn Nguyễn Đình Khang",
        "Lê Nguyễn Gia Khánh",
        "Nguyễn Hữu Khánh",
        "Hồ Thị Ngọc Lan",
        "Trần Thị Hồng Lỉnh",
        "Võ Thị Triệu Minh",
        "Hứa Đình Nghi",
        "Võ Thị Bảo Ngọc",
        "Lê Tiến Phát",
        "Nguyễn Hoàng Thông",
        "Nguyễn Kim Tiền",
        "Lê Thị Bảo Trân",
        "Võ Thị Diễm Trinh",
        "Nguyễn Tiến Trung",
        "Trần Thị Ánh Tuyết",
        "Đặng Nguyễn Khánh Uyên",
        "Nguyễn Thị Chúc Yến"
]
};

// Các tab được mở quyền truy cập cho lớp B212 (Mở Nhóm 1, Tổng quan và Công cụ; Khóa Nhóm 2-6)
const UNLOCKED_TABS_B212 = ['overview', 'group-benefits', 'tool-simulator', 'tool-flashcards'];

// Chuẩn hóa chuỗi so sánh họ tên
function normalizeStr(str) {
    return (str || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
}

// Kiểm tra quyền Giáo viên
function checkIfTeacher(name, classCode) {
    const formattedClass = (classCode || '').toUpperCase().replace(/\s+/g, '');
    const normName = normalizeStr(name || '');
    return formattedClass === 'GV' || 
           formattedClass === 'GV2026' ||
           normName === 'ptmn' || 
           normName.includes('ptmn') || 
           normName.includes('co nguyet') || 
           normName.includes('minh nguyet') || 
           normName.includes('ms nguyet') || 
           normName.includes('pham thi minh nguyet') ||
           normName === 'nguyet' ||
           normName.includes('giao vien');
}

// Áp dụng khóa/mở các nhóm đề thi
function applyAccessControl(isTeacher) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const target = item.dataset.target || item.getAttribute('data-target');
        const existingPill = item.querySelector('.lock-pill');
        if (existingPill) existingPill.remove();

        if (isTeacher || UNLOCKED_TABS_B212.includes(target)) {
            item.classList.remove('locked');
            item.removeAttribute('title');
        } else {
            item.classList.add('locked');
            item.setAttribute('title', 'Tạm khóa cho lớp B212');
            const link = item.querySelector('a');
            if (link) {
                const pill = document.createElement('span');
                pill.className = 'lock-pill';
                pill.innerHTML = '<i class="fa-solid fa-lock"></i> Khóa';
                link.appendChild(pill);
            }
        }
    });
}

// Authentication & Access Control
function initAuth() {
    const modal = document.getElementById('welcome-modal');
    const startBtn = document.getElementById('start-btn');
    const nameInput = document.getElementById('student-name');
    const classInput = document.getElementById('student-class');
    const errorMsg = document.getElementById('login-error');
    const displayName = document.getElementById('display-name');
    const userProfile = document.getElementById('user-profile');
    const userRoleLabel = userProfile ? userProfile.querySelector('.info span') : null;
    const userAvatar = userProfile ? userProfile.querySelector('.avatar') : null;

    // Luôn luôn hiển thị modal đăng nhập mỗi khi tải lại trang / refresh
    state.student.name = '';
    state.student.classCode = '';
    state.student.isTeacher = false;
    
    // Mặc định ban đầu áp dụng chế độ khóa cho học viên
    applyAccessControl(false);

    if (modal) {
        modal.style.display = 'flex';
        modal.classList.remove('hidden');
    }
    if (userProfile) {
        userProfile.classList.add('hidden');
    }
    if (nameInput) nameInput.value = '';
    if (classInput) classInput.value = '';
    if (errorMsg) errorMsg.style.display = 'none';

    // Cho phép nhấn vào profile để đăng xuất hoặc đổi tài khoản
    if (userProfile) {
        userProfile.style.cursor = 'pointer';
        userProfile.title = 'Nhấn để đổi tài khoản hoặc đăng xuất';
        userProfile.onclick = () => {
            if (confirm('Bạn có muốn đổi tài khoản hoặc đăng nhập lại không?')) {
                location.reload();
            }
        };
    }

    function handleLogin() {
        const nameVal = nameInput ? nameInput.value.trim() : '';
        const classVal = classInput ? classInput.value.trim() : '';

        if (!nameVal || !classVal) {
            if (errorMsg) {
                errorMsg.textContent = 'Vui lòng nhập đầy đủ Họ tên và Mã lớp!';
                errorMsg.style.display = 'block';
            }
            if (!nameVal && nameInput) nameInput.focus();
            else if (!classVal && classInput) classInput.focus();
            return;
        }

        let formattedClass = classVal.toUpperCase().replace(/\s+/g, '');
        const normName = normalizeStr(nameVal);

        // 1. Kiểm tra tài khoản Giáo viên (tên PTMN, mã lớp GV)
        const isTeacher = checkIfTeacher(nameVal, classVal);

        let finalName = '';
        let finalClass = '';

        if (isTeacher) {
            finalName = (normName === 'ptmn' || !nameVal) ? 'Cô Nguyệt (PTMN)' : nameVal;
            finalClass = formattedClass || 'GV';
            state.student.isTeacher = true;
        } else {
            // 2. Kiểm tra học viên thuộc lớp B212
            const allowedClasses = ['B212'];
            if (!allowedClasses.includes(formattedClass)) {
                if (errorMsg) {
                    errorMsg.textContent = 'Mã lớp không hợp lệ. Vui lòng kiểm tra lại!';
                    errorMsg.style.display = 'block';
                }
                if (classInput) classInput.focus();
                return;
            }

            const roster = CLASS_STUDENTS[formattedClass];
            const matchedStudent = roster ? roster.find(s => normalizeStr(s) === normName) : null;

            if (!matchedStudent) {
                if (errorMsg) {
                    errorMsg.textContent = `Họ và tên không thuộc danh sách lớp ${formattedClass}. Vui lòng kiểm tra lại chính tả!`;
                    errorMsg.style.display = 'block';
                }
                if (nameInput) nameInput.focus();
                return;
            }

            finalName = matchedStudent;
            finalClass = formattedClass;
            state.student.isTeacher = false;
        }

        if (errorMsg) errorMsg.style.display = 'none';

        state.student.name = finalName;
        state.student.classCode = finalClass;

        // Áp dụng quyền truy cập: mở Nhóm 1 cho B212, mở tất cả nếu là Giáo viên
        applyAccessControl(state.student.isTeacher);
        if (typeof window.refreshSimulatorTopics === 'function') {
            window.refreshSimulatorTopics(state.student.isTeacher);
        }

        // Nếu tab hiện tại đang bị khóa thì tự động chuyển về Nhóm 1
        const activeNav = document.querySelector('.nav-item.active');
        const currentTarget = activeNav ? activeNav.getAttribute('data-target') : 'overview';
        if (!state.student.isTeacher && !UNLOCKED_TABS_B212.includes(currentTarget)) {
            if (typeof window.switchTab === 'function') {
                window.switchTab('group-benefits');
            }
        }

        const logData = `${finalName} - Lớp: ${finalClass}`;
        const trackingUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScpre6r5axG648nbdv1kiNUHV1JXmF2Fssv0top8w-SpnFcWw/formResponse';

        try {
            const entry = document.getElementById('entry_388968236');
            const form = document.getElementById('google-form') || document.getElementById('tracking-form');
            if (entry && form) {
                entry.value = logData;
                form.submit();
            }
        } catch (e) {
            console.warn('Iframe attendance submit warning:', e);
        }

        try {
            const formData = new FormData();
            formData.append('entry.388968236', logData);
            fetch(trackingUrl, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            }).catch(e => console.warn('Fetch tracking warning:', e));
        } catch (e) {
            console.warn('Fetch init warning:', e);
        }

        if (modal) modal.style.display = 'none';
        if (displayName) displayName.innerText = finalName + ' (' + finalClass + ')';
        if (userRoleLabel) userRoleLabel.innerText = state.student.isTeacher ? 'Giáo viên' : 'Học viên';
        if (userAvatar && state.student.isTeacher) {
            userAvatar.innerHTML = '<i class="fa-solid fa-chalkboard-user"></i>';
        }
        if (userProfile) userProfile.classList.remove('hidden');

        showToast(`Chào mừng ${finalName} - Lớp ${finalClass} đến với bài học Speaking Part 03! 🚀`);
        if (window.confetti) {
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        }
    }

    if (startBtn) {
        startBtn.onclick = handleLogin;
    }

    // Hỗ trợ phím Enter để đăng nhập nhanh
    if (nameInput) {
        nameInput.onkeypress = (e) => {
            if (e.key === 'Enter') {
                if (classInput && !classInput.value.trim()) {
                    classInput.focus();
                } else {
                    handleLogin();
                }
            }
        };
    }
    if (classInput) {
        classInput.onkeypress = (e) => {
            if (e.key === 'Enter') {
                handleLogin();
            }
        };
    }
}

// Theme
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    if (state.theme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-theme');
            state.theme = isDark ? 'dark' : 'light';
            localStorage.setItem('vstep_sp3_theme', state.theme);
            themeBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        });
    }
}

// Voices & Speech
function initVoices() {
    const voiceSelect = document.getElementById('voice-select');
    const speedSelect = document.getElementById('speed-select');

    function populateVoices() {
        if (!('speechSynthesis' in window)) return;
        const voices = window.speechSynthesis.getVoices();
        if (!voiceSelect) return;
        voiceSelect.innerHTML = '<option value="">🌿 Giọng tự nhiên...</option>';
        voices.filter(v => v.lang.startsWith('en')).forEach(v => {
            const opt = document.createElement('option');
            opt.value = v.voiceURI;
            opt.textContent = v.name + ' (' + v.lang + ')';
            if (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David')) {
                opt.selected = true;
                state.selectedVoiceURI = v.voiceURI;
            }
            voiceSelect.appendChild(opt);
        });
    }

    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = populateVoices;
        populateVoices();
    }

    if (voiceSelect) {
        voiceSelect.addEventListener('change', (e) => {
            state.selectedVoiceURI = e.target.value;
        });
    }

    if (speedSelect) {
        speedSelect.addEventListener('change', (e) => {
            state.speechRate = parseFloat(e.target.value) || 1.0;
        });
    }
}

// Navigation
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const topTitle = document.getElementById('top-title');
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');

    window.switchTab = function(targetId) {
        const isTeacher = state.student.isTeacher || checkIfTeacher(state.student.name, state.student.classCode);
        if (!isTeacher && !UNLOCKED_TABS_B212.includes(targetId)) {
            showToast('🔒 Nhóm bài học này đang tạm khóa cho lớp B212 và sẽ được mở trong các buổi học tiếp theo!');
            targetId = 'group-benefits';
        }

        navItems.forEach(i => {
            if (i.getAttribute('data-target') === targetId) {
                i.classList.add('active');
            } else {
                i.classList.remove('active');
            }
        });

        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        const targetPane = document.getElementById(targetId);
        if (targetPane) {
            targetPane.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        const activeItem = document.querySelector(`.nav-item[data-target="${targetId}"]`);
        if (activeItem && topTitle) {
            const rawTitle = activeItem.querySelector('span') ? activeItem.querySelector('span').innerText : targetId;
            topTitle.innerText = rawTitle.replace('Khóa', '').trim();
        }

        if (sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            if (backdrop) backdrop.classList.remove('open');
        }
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-target');
            if (!targetId) return;

            const isTeacher = state.student.isTeacher || checkIfTeacher(state.student.name, state.student.classCode);
            if (!isTeacher && !UNLOCKED_TABS_B212.includes(targetId)) {
                showToast('🔒 Nhóm bài học này đang tạm khóa cho lớp B212 và sẽ được mở trong các buổi học tiếp theo!');
                return;
            }

            window.switchTab(targetId);
        });
    });

    if (mobileToggle && sidebar && backdrop) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.add('open');
            backdrop.classList.add('open');
        });
        backdrop.addEventListener('click', () => {
            sidebar.classList.remove('open');
            backdrop.classList.remove('open');
        });
    }
}

// Subtab switcher
window.switchSubTab = function(btn, panelId) {
    const parentPane = btn.closest('.tab-pane') || document;
    parentPane.querySelectorAll('.cat-subtab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    parentPane.querySelectorAll('.sub-tab-panel').forEach(p => p.classList.remove('active'));
    const targetPanel = document.getElementById(panelId);
    if (targetPanel) targetPanel.classList.add('active');
};

// Text-to-Speech
window.speakText = function(text, btn) {
    if (!('speechSynthesis' in window)) {
        alert('Trình duyệt của bạn không hỗ trợ tính năng đọc âm thanh!');
        return;
    }
    window.speechSynthesis.cancel();
    if (!text) return;

    // Automatically strip any HTML tags before speech synthesis
    const cleanSpeechText = text.replace(/<[^>]*>/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
    utterance.lang = 'en-US';
    utterance.rate = state.speechRate || 1.0;

    if (state.selectedVoiceURI) {
        const voices = window.speechSynthesis.getVoices();
        const found = voices.find(v => v.voiceURI === state.selectedVoiceURI);
        if (found) utterance.voice = found;
    }

    if (btn) {
        btn.classList.add('speaking');
        utterance.onend = () => btn.classList.remove('speaking');
        utterance.onerror = () => btn.classList.remove('speaking');
    }

    window.speechSynthesis.speak(utterance);
};

window.copyText = function(text) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        showToast('Đã sao chép vào bộ nhớ tạm!');
    }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('Đã sao chép vào bộ nhớ tạm!');
    });
};


window.showOverviewMindmapDetail = function(branchNum) {
    const detailBox = document.getElementById('overview-mm-detail');
    if (!detailBox) return;
    
    const details = {
        1: {
            title: 'Nhánh 1 (Top): Flexible (Tính từ)',
            en: 'One major benefit of online learning is that it is flexible.',
            vi: 'Một lợi ích lớn của việc học trực tuyến là nó rất linh hoạt (về thời gian và địa điểm học tập).',
            expand: 'Because students can study anywhere and at any time they want without traveling.'
        },
        2: {
            title: 'Nhánh 2 (Right): Convenient (Tính từ)',
            en: 'Another benefit is that it is convenient for everyone.',
            vi: 'Một lợi ích khác là việc học trực tuyến rất thuận tiện cho tất cả mọi người.',
            expand: 'Because they just need an internet-connected smartphone or laptop to join classes.'
        },
        3: {
            title: 'Nhánh 3 (Bottom): Cost-effective (Tính từ)',
            en: 'One more benefit of online learning is that it is cost-effective.',
            vi: 'Thêm một lợi ích nữa là học online giúp tiết kiệm chi phí học tập và đi lại.',
            expand: 'In other words, they can save money on transportation, accommodation, and printed materials.'
        },
        4: {
            title: 'Nhánh 4 (Left): [Your own idea] - Self-paced (Tự do)',
            en: 'In addition, it allows students to learn at their own pace.',
            vi: 'Ngoài ra, nó cho phép học sinh học theo tiến độ riêng của bản thân.',
            expand: 'For example, they can re-watch recorded video lectures whenever they do not understand a lesson.'
        }
    };
    
    const data = details[branchNum];
    if (!data) return;
    
    detailBox.innerHTML = `
        <div style="background: var(--bg-card); border-left: 4px solid var(--primary); padding: 1.25rem; border-radius: 12px; box-shadow: var(--shadow-sm); margin-top: 1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.5rem;">
                <strong style="color: var(--primary); font-size: 1.05rem;">${data.title}</strong>
                <button class="btn-pill-tts" onclick="speakText('${data.en} ${data.expand}')"><i class="fa-solid fa-volume-high"></i> Nghe</button>
            </div>
            <p style="font-size: 1.05rem; font-weight: 600; color: var(--text-main); margin-bottom: 0.4rem;">${data.en}</p>
            <p style="font-size: 0.95rem; color: var(--text-light); margin-bottom: 0.6rem;">${data.vi}</p>
            <div style="font-size: 0.95rem; color: var(--primary-dark); background: rgba(79, 70, 229, 0.08); padding: 0.5rem 0.85rem; border-radius: 8px;">
                <strong>Câu mở rộng:</strong> ${data.expand}
            </div>
        </div>
    `;
    detailBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

window.toggleTranslation = function(targetId, btn) {
    const el = document.getElementById(targetId);
    if (!el) return;
    const isHidden = el.style.display === 'none';
    el.style.display = isHidden ? 'block' : 'none';
    if (btn) {
        btn.innerHTML = isHidden ? '<i class="fa-solid fa-eye-slash"></i> Ẩn bản dịch' : '<i class="fa-solid fa-language"></i> Xem bản dịch';
    }
};

// Interactive Mindmaps
function renderAllMindmaps() {
    document.querySelectorAll('.mindmap-branch-card').forEach(card => {
        card.addEventListener('click', () => {
            const exp = card.querySelector('.branch-expand-content');
            if (exp) {
                const isOpen = exp.style.display === 'block';
                exp.style.display = isOpen ? 'none' : 'block';
                card.classList.toggle('active', !isOpen);
            }
        });
    });
}

// Exam Simulator & Recorder
function initExamSimulator() {
    const topicSelect = document.getElementById('sim-topic-select');
    const randomBtn = document.getElementById('sim-random-btn');
    const startBtn = document.getElementById('sim-start-btn');
    const pauseBtn = document.getElementById('sim-pause-btn');
    const resetBtn = document.getElementById('sim-reset-btn');
    const timeDisplay = document.getElementById('sim-time-display');
    const phasePill = document.getElementById('sim-phase-pill');
    const circleProg = document.getElementById('sim-circle-progress');
    const promptContainer = document.getElementById('sim-prompt-display');
    const recStatus = document.getElementById('sim-rec-status');
    const playerAudio = document.getElementById('sim-audio-player');
    const downloadAudioBtn = document.getElementById('sim-download-audio-btn');

    window.refreshSimulatorTopics = function(isTeacher) {
        if (!topicSelect) return;
        topicSelect.innerHTML = '';

        const availableTopics = isTeacher 
            ? ALL_TOPICS_POOL 
            : ALL_TOPICS_POOL.filter(t => t.category === 'benefits');

        availableTopics.forEach((t) => {
            const opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = '[' + t.categoryName + '] ' + t.title;
            topicSelect.appendChild(opt);
        });

        // Với học viên B212: Hiển thị các chủ đề của nhóm 2-6 dưới dạng tạm khóa
        if (!isTeacher) {
            const lockedTopics = ALL_TOPICS_POOL.filter(t => t.category !== 'benefits');
            if (lockedTopics.length > 0) {
                const optGroup = document.createElement('optgroup');
                optGroup.label = '── 🔒 CÁC CHỦ ĐỀ ĐANG TẠM KHÓA (LỚP B212) ──';
                lockedTopics.forEach(t => {
                    const opt = document.createElement('option');
                    opt.value = t.id;
                    opt.disabled = true;
                    opt.textContent = '🔒 [' + t.categoryName + '] ' + t.title;
                    optGroup.appendChild(opt);
                });
                topicSelect.appendChild(optGroup);
            }
        }

        if (availableTopics.length > 0) {
            topicSelect.value = availableTopics[0].id;
            loadSimTopic(availableTopics[0]);
        }
    };

    window.refreshSimulatorTopics(state.student.isTeacher);

    if (topicSelect) {
        topicSelect.addEventListener('change', () => {
            const found = ALL_TOPICS_POOL.find(t => t.id === topicSelect.value);
            if (found) loadSimTopic(found);
        });
    }

    if (randomBtn) {
        randomBtn.addEventListener('click', () => {
            const isTeacher = state.student.isTeacher || checkIfTeacher(state.student.name, state.student.classCode);
            const pool = isTeacher 
                ? ALL_TOPICS_POOL 
                : ALL_TOPICS_POOL.filter(t => t.category === 'benefits');
            if (!pool || pool.length === 0) return;
            const randIdx = Math.floor(Math.random() * pool.length);
            const randTopic = pool[randIdx];
            if (topicSelect) topicSelect.value = randTopic.id;
            loadSimTopic(randTopic);
            showToast('Đã chọn ngẫu nhiên chủ đề mới!');
        });
    }

    function loadSimTopic(topic) {
        state.currentSimTopic = topic;
        if (!promptContainer) return;

        const centerTitle = topic.center || topic.central || topic.title || '';
        const branches = topic.branches || [];
        const b1 = branches[0] || { text: '', vi: '', type: 'verb' };
        const b2 = branches[1] || { text: '', vi: '', type: 'verb' };
        const b3 = branches[2] || { text: '', vi: '', type: 'verb' };

        const tagMap = {
            'verb': 'Động từ',
            'adj': 'Tính từ',
            'noun': 'Danh từ',
            'clause': 'Mệnh đề',
            'free': 'Tự do'
        };

        const b1Tag = tagMap[b1.type] || 'Ý chính';
        const b2Tag = tagMap[b2.type] || 'Ý chính';
        const b3Tag = tagMap[b3.type] || 'Ý chính';

        const fuCards = (topic.followups || []).map((f, idx) => {
            const qClean = (f.q || '').replace(/'/g, "\\'");
            return `
                <div class="followup-card" style="background:var(--bg-subtle, #f8fafc); border:1px solid var(--border); border-radius:8px; padding:0.85rem 1rem; margin-bottom:0.75rem;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem;">
                        <div style="flex:1;">
                            <div style="font-weight:700; font-size:0.95rem; color:var(--text-main); line-height:1.5;">
                                <span style="background:var(--primary); color:#ffffff; font-size:0.75rem; font-weight:700; padding:0.15rem 0.5rem; border-radius:4px; margin-right:0.4rem;">CÂU ${idx + 1}</span>
                                ${f.q}
                            </div>
                            <div style="font-size:0.85rem; color:var(--text-muted); margin-top:0.25rem;">↳ Dịch: ${f.vi || f.qVi || ''}</div>
                        </div>
                        <button class="practice-act-btn" onclick="speakText('${qClean}', this)" style="padding:0.25rem 0.65rem; font-size:0.8rem; flex-shrink:0;">
                            <i class="fa-solid fa-volume-high"></i> Nghe câu hỏi
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        promptContainer.innerHTML = `
            <div style="background: var(--bg-subtle); border: 1.5px solid var(--border); border-radius: var(--radius-md); padding: 1.25rem 1.5rem; margin-bottom: 1.25rem;">
                <span style="font-size: 0.8rem; font-weight: 700; color: var(--primary); text-transform: uppercase;">${topic.categoryName || ''}</span>
                <h3 style="font-size: 1.25rem; margin: 0.35rem 0 0.5rem; color: var(--text-main);">${topic.title || ''}</h3>
                ${topic.titleVi ? `<div style="font-size: 0.92rem; color: var(--text-muted); font-style: italic;">${topic.titleVi}</div>` : ''}
            </div>

            <!-- Mindmap Box Chuẩn VSTEP 4 Hướng -->
            <div class="mindmap-vstep-container" style="background:var(--bg-card); border:1.5px solid var(--border); border-radius:12px; box-shadow:none; padding:1.25rem 0.85rem; margin:0.85rem 0;">
                <div class="mindmap-cross-grid">
                    <div class="grid-top">
                        <div class="mm-node-card">
                            <div class="mm-node-badge">1</div>
                            <div class="mm-node-title">${b1.text || ''}</div>
                            <div class="mm-node-vi">${b1.vi || ''}</div>
                            <span class="mm-node-type-tag tag-${b1.type || 'verb'}">${b1Tag}</span>
                        </div>
                    </div>
                    <div class="grid-left">
                        <div class="mm-node-card" style="border-style:dashed; border-color:var(--amber);">
                            <div class="mm-node-badge" style="background:var(--amber);">4</div>
                            <div class="mm-node-title">[Your own idea]</div>
                            <div class="mm-node-vi">Ý kiến riêng của bạn</div>
                            <span class="mm-node-type-tag tag-free">Tự do</span>
                        </div>
                    </div>
                    <div class="grid-center">
                        <div class="mm-hub-box">
                            <span class="mm-hub-label">Chủ đề</span>
                            ${centerTitle}
                        </div>
                    </div>
                    <div class="grid-right">
                        <div class="mm-node-card">
                            <div class="mm-node-badge">2</div>
                            <div class="mm-node-title">${b2.text || ''}</div>
                            <div class="mm-node-vi">${b2.vi || ''}</div>
                            <span class="mm-node-type-tag tag-${b2.type || 'verb'}">${b2Tag}</span>
                        </div>
                    </div>
                    <div class="grid-bottom">
                        <div class="mm-node-card">
                            <div class="mm-node-badge">3</div>
                            <div class="mm-node-title">${b3.text || ''}</div>
                            <div class="mm-node-vi">${b3.vi || ''}</div>
                            <span class="mm-node-type-tag tag-${b3.type || 'verb'}">${b3Tag}</span>
                        </div>
                    </div>
                </div>

                <!-- Câu hỏi mở rộng đi cùng sơ đồ tư duy (KHÔNG CÓ ĐÁP ÁN SẴN) -->
                <div class="mindmap-followups-section" style="margin-top:2rem; border-top:1.5px dashed var(--border); padding-top:1.25rem;">
                    <div class="mindmap-followups-header" style="font-size:1.05rem; font-weight:800; color:var(--text-main); margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
                        <i class="fa-solid fa-comments" style="color:var(--primary);"></i>
                        <span>CÂU HỎI MỞ RỘNG (FOLLOW-UP QUESTIONS):</span>
                    </div>
                    <div class="mindmap-fu-list">
                        ${fuCards}
                    </div>
                </div>
            </div>
        `;
    }

    if (ALL_TOPICS_POOL.length > 0) loadSimTopic(ALL_TOPICS_POOL[0]);

    // Timer Controls
    const CIRCUMFERENCE = 565;
    function updateTimerUI() {
        const mins = Math.floor(state.simTimer.timeLeft / 60);
        const secs = state.simTimer.timeLeft % 60;
        if (timeDisplay) timeDisplay.innerText = String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');

        if (circleProg) {
            const offset = CIRCUMFERENCE - (state.simTimer.timeLeft / state.simTimer.totalTime) * CIRCUMFERENCE;
            circleProg.style.strokeDashoffset = offset;
        }
    }

    function playBeep(freq = 600, duration = 300) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            osc.start();
            osc.stop(ctx.currentTime + duration / 1000);
        } catch (e) {}
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (state.simTimer.phase === 'ready' || state.simTimer.phase === 'done') {
                state.simTimer.phase = 'prep';
                state.simTimer.timeLeft = 60;
                state.simTimer.totalTime = 60;
                if (phasePill) {
                    phasePill.className = 'phase-pill prep';
                    phasePill.innerText = 'Chuẩn bị (1 phút)';
                }
                if (circleProg) circleProg.style.stroke = 'var(--amber)';
                playBeep(440, 400);
                startInterval();
                startBtn.innerHTML = '<i class="fa-solid fa-forward-step"></i> Bỏ qua chuẩn bị';
            } else if (state.simTimer.phase === 'prep') {
                switchToSpeaking();
            }
        });
    }

    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            if (!state.simTimer.interval) return;
            state.simTimer.isPaused = !state.simTimer.isPaused;
            pauseBtn.innerHTML = state.simTimer.isPaused ? '<i class="fa-solid fa-play"></i> Tiếp tục' : '<i class="fa-solid fa-pause"></i> Tạm dừng';
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            clearInterval(state.simTimer.interval);
            state.simTimer.interval = null;
            state.simTimer.phase = 'ready';
            state.simTimer.timeLeft = 60;
            state.simTimer.totalTime = 60;
            state.simTimer.isPaused = false;
            if (phasePill) {
                phasePill.className = 'phase-pill ready';
                phasePill.innerText = 'Sẵn sàng';
            }
            if (circleProg) {
                circleProg.style.stroke = 'var(--primary)';
                circleProg.style.strokeDashoffset = 0;
            }
            if (startBtn) startBtn.innerHTML = '<i class="fa-solid fa-play"></i> Bắt đầu làm bài';
            if (pauseBtn) pauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Tạm dừng';
            stopRecording();
            updateTimerUI();
        });
    }

    function startInterval() {
        if (state.simTimer.interval) clearInterval(state.simTimer.interval);
        state.simTimer.interval = setInterval(() => {
            if (state.simTimer.isPaused) return;

            if (state.simTimer.timeLeft > 0) {
                state.simTimer.timeLeft--;
                updateTimerUI();
            } else {
                if (state.simTimer.phase === 'prep') {
                    switchToSpeaking();
                } else if (state.simTimer.phase === 'speaking') {
                    finishExam();
                }
            }
        }, 1000);
    }

    function switchToSpeaking() {
        state.simTimer.phase = 'speaking';
        state.simTimer.timeLeft = 240;
        state.simTimer.totalTime = 240;
        if (phasePill) {
            phasePill.className = 'phase-pill speaking';
            phasePill.innerText = 'Đang trình bày (4 phút)';
        }
        if (circleProg) circleProg.style.stroke = 'var(--emerald)';
        playBeep(880, 800);
        showToast('Hết giờ chuẩn bị! Bắt đầu 4 phút nói.');
        startRecording();
        if (startBtn) startBtn.innerHTML = '<i class="fa-solid fa-check"></i> Nộp bài sớm';
    }

    function finishExam() {
        clearInterval(state.simTimer.interval);
        state.simTimer.interval = null;
        state.simTimer.phase = 'done';
        if (phasePill) {
            phasePill.className = 'phase-pill done';
            phasePill.innerText = 'Hoàn thành';
        }
        if (circleProg) circleProg.style.stroke = 'var(--rose)';
        playBeep(523, 1000);
        stopRecording();
        showToast('Đã hết giờ làm bài!');
        if (window.confetti) {
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        }
    }

    // Audio Recorder
    function startRecording() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            if (recStatus) recStatus.innerText = 'Trình duyệt không hỗ trợ micro thu âm.';
            return;
        }

        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            state.audioRecorder.mediaRecorder = new MediaRecorder(stream);
            state.audioRecorder.audioChunks = [];

            state.audioRecorder.mediaRecorder.ondataavailable = e => {
                if (e.data.size > 0) state.audioRecorder.audioChunks.push(e.data);
            };

            state.audioRecorder.mediaRecorder.onstop = () => {
                state.audioRecorder.audioBlob = new Blob(state.audioRecorder.audioChunks, { type: 'audio/webm' });
                state.audioRecorder.audioUrl = URL.createObjectURL(state.audioRecorder.audioBlob);
                if (playerAudio) {
                    playerAudio.src = state.audioRecorder.audioUrl;
                    playerAudio.style.display = 'block';
                }
                if (downloadAudioBtn) {
                    downloadAudioBtn.style.display = 'inline-flex';
                    downloadAudioBtn.onclick = () => {
                        const a = document.createElement('a');
                        a.href = state.audioRecorder.audioUrl;
                        a.download = 'SpeakingPart3_' + (state.student.name || 'Student') + '.webm';
                        a.click();
                    };
                }
                if (recStatus) recStatus.innerHTML = '<i class="fa-solid fa-circle-check" style="color:var(--emerald);"></i> Đã lưu file ghi âm bài nói!';
            };

            state.audioRecorder.mediaRecorder.start();
            if (recStatus) recStatus.innerHTML = '<div class="recording-dot"></div> Đang ghi âm bài nói qua Micro...';
        }).catch(err => {
            console.error('Mic access error:', err);
            if (recStatus) recStatus.innerText = 'Không thể kết nối Micro (Vui lòng cấp quyền)';
        });
    }

    function stopRecording() {
        if (state.audioRecorder.mediaRecorder && state.audioRecorder.mediaRecorder.state === 'recording') {
            state.audioRecorder.mediaRecorder.stop();
        }
    }
}

// Flashcards
function initFlashcards() {
    const cardEl = document.getElementById('flashcard-box');
    const prevBtn = document.getElementById('card-prev-btn');
    const nextBtn = document.getElementById('card-next-btn');
    const shuffleBtn = document.getElementById('card-shuffle-btn');
    const speakBtn = document.getElementById('card-speak-btn');
    const counterEl = document.getElementById('card-counter');

    const catBadge = document.getElementById('card-cat-badge');
    const frontText = document.getElementById('card-front-text');
    const backText = document.getElementById('card-back-text');
    const backEx = document.getElementById('card-back-example');

    function updateCard() {
        if (FLASHCARDS_DATA.length === 0) return;
        const cur = FLASHCARDS_DATA[state.cardIndex];
        if (cardEl) cardEl.classList.remove('flipped');
        if (catBadge) catBadge.innerText = cur.cat;
        if (frontText) frontText.innerText = cur.front;
        if (backText) backText.innerText = cur.back;
        if (backEx) backEx.innerText = 'Ví dụ: ' + cur.ex;
        if (counterEl) counterEl.innerText = (state.cardIndex + 1) + ' / ' + FLASHCARDS_DATA.length;
    }

    if (cardEl) {
        cardEl.addEventListener('click', () => cardEl.classList.toggle('flipped'));
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            state.cardIndex = (state.cardIndex - 1 + FLASHCARDS_DATA.length) % FLASHCARDS_DATA.length;
            updateCard();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            state.cardIndex = (state.cardIndex + 1) % FLASHCARDS_DATA.length;
            updateCard();
        });
    }

    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', () => {
            for (let i = FLASHCARDS_DATA.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [FLASHCARDS_DATA[i], FLASHCARDS_DATA[j]] = [FLASHCARDS_DATA[j], FLASHCARDS_DATA[i]];
            }
            state.cardIndex = 0;
            updateCard();
            showToast('Đã xáo trộn danh sách thẻ!');
        });
    }

    if (speakBtn) {
        speakBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const cur = FLASHCARDS_DATA[state.cardIndex];
            speakText(cur.front);
        });
    }

    updateCard();
}

// Toast
function showToast(msg) {
    const existing = document.querySelector('.toast-msg');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = '<i class="fa-solid fa-circle-check" style="color:#10b981;"></i> ' + msg;
    document.body.appendChild(toast);
    setTimeout(() => {
        if (toast && toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3000);
}
