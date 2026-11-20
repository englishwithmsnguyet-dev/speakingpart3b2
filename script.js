
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
    const hasFullAccess = typeof checkHasFullAccess === 'function' ? checkHasFullAccess() : state.student.isTeacher;
    const topic = ALL_TOPICS_POOL.find(t => t.id === tid);
    if (!hasFullAccess && topic && topic.category !== 'benefits') {
        showToast(`🔒 Đề thi này thuộc nhóm đang tạm khóa cho lớp ${state.student.classCode || 'B212'}!`);
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
        "a": "One big drawback is that teammates can have <strong>different opinions</strong>, which may lead to <strong>heated arguments</strong> and slow the work down. Also, some people might rely too much on others and make <strong>work feel unfair</strong>."
      },
      {
        "q": "In your opinion, how can organizations encourage effective teamwork?",
        "vi": "Theo bạn, các tổ chức có thể khuyến khích làm việc nhóm hiệu quả bằng cách nào?",
        "a": "Companies should set <strong>clear team goals</strong> and give each person a <strong>specific role</strong> so everyone knows what to do. Planning <strong>fun team activities</strong> also helps workers get close and work together smoothly."
      },
      {
        "q": "Do you think teamwork is more beneficial for young people or older people? Why?",
        "vi": "Bạn có nghĩ làm việc nhóm có lợi hơn cho người trẻ hay người lớn tuổi?",
        "a": "I think teamwork is especially <strong>helpful for young people</strong> because they are still learning key <strong>workplace habits</strong>. Working in groups teaches them how to accept <strong>helpful advice</strong> and fit easily into real workplaces."
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
        "text": "Create job opportunities",
        "pos": "top",
        "type": "verb",
        "vi": "Tạo cơ hội việc làm"
      },
      {
        "num": 2,
        "text": "Improve work performance",
        "pos": "right",
        "type": "verb",
        "vi": "Nâng cao hiệu suất công việc"
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
        "a": "Yes, I strongly believe soft skills are <strong>very important today</strong> because <strong>good grades alone</strong> cannot guarantee success at work. Having <strong>strong people skills</strong> helps individuals <strong>communicate clearly</strong> and <strong>work well</strong> with different people."
      },
      {
        "q": "Which soft skill do you think is the most important?",
        "vi": "Kỹ năng mềm nào bạn nghĩ là quan trọng nhất?",
        "a": "In my opinion, <strong>effective communication</strong> is the most important skill because it is the base of all <strong>daily interactions</strong>. When people <strong>express ideas clearly</strong> and <strong>listen carefully</strong>, they can <strong>avoid misunderstandings</strong> and <strong>solve problems faster</strong>."
      },
      {
        "q": "Do you think young people generally have better soft skills than older people?",
        "vi": "Bạn có nghĩ người trẻ nhìn chung có kỹ năng mềm tốt hơn người lớn tuổi không?",
        "a": "I think each generation has its own strengths. While young people <strong>adapt quickly</strong> and feel comfortable with <strong>online communication</strong>, older people usually <strong>control their emotions</strong> better and have stronger <strong>real-world people skills</strong> from life experience."
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
        "vi": "Linh hoạt"
      },
      {
        "num": 2,
        "text": "Time-saving",
        "pos": "right",
        "type": "adj",
        "vi": "Tiết kiệm thời gian"
      },
      {
        "num": 3,
        "text": "Money-saving",
        "pos": "bottom",
        "type": "adj",
        "vi": "Tiết kiệm tiền bạc"
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
        "a": "No, I do not think online learning will <strong>completely replace</strong> traditional schools because <strong>talking in person</strong> is still very important. Going to a real classroom gives students <strong>hands-on practice</strong> and helps them build <strong>natural social skills</strong>."
      },
      {
        "q": "What are some disadvantages of online learning?",
        "vi": "Một số bất lợi của học trực tuyến?",
        "a": "One big problem is that students can easily <strong>get distracted</strong> by games or social media when there is no teacher nearby. Also, looking at a screen for hours can <strong>hurt their eyes</strong> and make them feel <strong>lonely at home</strong>."
      },
      {
        "q": "How can students study online more effectively?",
        "vi": "Làm thế nào để học trực tuyến hiệu quả hơn?",
        "a": "Students can study better by choosing a <strong>quiet study space</strong> and keeping a <strong>regular daily routine</strong>. In addition, <strong>joining class discussions</strong> and <strong>taking clear notes</strong> will help them understand the lessons much more deeply."
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
        "a": "Body language is very important in presentations because it <strong>keeps the audience interested</strong> and shows <strong>real confidence</strong>. Making <strong>natural eye contact</strong> and using <strong>clear hand movements</strong> helps speakers highlight key points smoothly."
      },
      {
        "q": "Can body language cause misunderstandings in different cultures?",
        "vi": "Ngôn ngữ cơ thể có gây hiểu lầm giữa các nền văn hóa không?",
        "a": "Yes, definitely, because the same gesture can have <strong>different meanings</strong> in different countries. For example, a thumbs-up sign is friendly in many places, while it can be <strong>seen as rude</strong> in some parts of the world."
      },
      {
        "q": "How can people improve their body language?",
        "vi": "Làm thế nào để cải thiện ngôn ngữ cơ thể?",
        "a": "People can improve by <strong>recording their talks</strong> on video and checking how they <strong>stand and move</strong>. Also, practicing <strong>relaxed eye contact</strong> and smiling naturally during daily chats builds great confidence."
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
        "vi": "Phát triển bản thân"
      },
      {
        "num": 2,
        "text": "See the world",
        "pos": "right",
        "type": "verb",
        "vi": "Khám phá thế giới"
      },
      {
        "num": 3,
        "text": "Experience different styles of education",
        "pos": "bottom",
        "type": "verb",
        "vi": "Trải nghiệm các nền giáo dục khác nhau"
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
        "a": "International students often deal with <strong>language problems</strong>, strong <strong>feelings of homesickness</strong>, and culture shock. Besides, getting used to <strong>unfamiliar local food</strong> and managing a tight budget can be quite stressful at first."
      },
      {
        "q": "Should students work part-time while studying abroad?",
        "vi": "Du học sinh có nên làm thêm không?",
        "a": "I think having a <strong>part-time job</strong> is helpful because it brings <strong>extra money</strong> and gives students chances to <strong>practice talking with locals</strong>. However, students should <strong>balance their hours</strong> so work does not affect their studies."
      },
      {
        "q": "Do you prefer studying abroad or studying in your home country?",
        "vi": "Bạn thích du học hay học trong nước?",
        "a": "Personally, I prefer studying abroad because it pushes me to <strong>step outside my comfort zone</strong> and improves my <strong>language skills much faster</strong>. Learning in an <strong>international environment</strong> also brings better job chances after graduation."
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
        "vi": "Giao tiếp"
      },
      {
        "num": 2,
        "text": "Career and job opportunities",
        "pos": "right",
        "type": "noun",
        "vi": "Cơ hội nghề nghiệp & việc làm"
      },
      {
        "num": 3,
        "text": "Academic purposes",
        "pos": "bottom",
        "type": "noun",
        "vi": "Mục đích học thuật"
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
        "a": "I believe children should start learning English around <strong>five or six years old</strong> after they can speak their <strong>first language well</strong>. At this young age, kids <strong>pick up natural pronunciation</strong> easily through simple songs and cartoons."
      },
      {
        "q": "What is the best way to practice English speaking?",
        "vi": "Cách tốt nhất để luyện nói tiếng Anh?",
        "a": "The best way is to practice talking regularly with <strong>friendly partners</strong> or join an <strong>English speaking club</strong>. Also, <strong>repeating after short podcasts</strong> and talking to yourself every day builds natural confidence."
      },
      {
        "q": "Is English the most useful language in the world?",
        "vi": "Tiếng Anh có phải là ngôn ngữ hữu ích nhất?",
        "a": "Yes, English is still the most useful language because it is the <strong>main common language</strong> in <strong>global business</strong>, travel, and the Internet. Even though other languages have huge speaker numbers, English connects people around the world."
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
        "vi": "Trở nên tự lập và hòa đồng hơn"
      },
      {
        "num": 2,
        "text": "Better preparation for formal schooling",
        "pos": "right",
        "type": "noun",
        "vi": "Chuẩn bị tốt hơn cho việc học chính thức"
      },
      {
        "num": 3,
        "text": "Support parents in balancing work and family life",
        "pos": "bottom",
        "type": "verb",
        "vi": "Hỗ trợ cha mẹ cân bằng công việc và gia đình"
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
        "a": "One common problem is that young kids often <strong>miss their parents</strong> and cry during the <strong>first few weeks</strong>. Also, being around many children makes it easier to catch <strong>common colds</strong> or small coughs."
      },
      {
        "q": "What should parents look for when choosing a preschool?",
        "vi": "Phụ huynh nên chú ý điều gì khi chọn trường mầm non?",
        "a": "Parents should look for a <strong>clean, safe school</strong> with <strong>kind, patient teachers</strong>. In addition, a good daily program that balances <strong>fun indoor games</strong> with <strong>outdoor play time</strong> helps children grow happily."
      },
      {
        "q": "Should preschool focus on academics or playtime?",
        "vi": "Mầm non nên chú trọng học chữ hay vui chơi?",
        "a": "I strongly believe preschool should focus on <strong>learning through play</strong> and <strong>getting along with others</strong> rather than heavy study. At this young age, building curiosity and good manners matters much more than memorizing difficult lessons."
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
        "vi": "Mức độ hài lòng công việc cao hơn"
      },
      {
        "num": 2,
        "text": "Higher levels of creativity",
        "pos": "right",
        "type": "noun",
        "vi": "Mức độ sáng tạo cao hơn"
      },
      {
        "num": 3,
        "text": "Higher levels of cooperation and teamwork",
        "pos": "bottom",
        "type": "noun",
        "vi": "Mức độ hợp tác và làm việc nhóm cao hơn"
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
        "a": "Coworkers should have a <strong>calm private chat</strong> to talk about the issue honestly and listen with <strong>an open mind</strong>. If they still disagree, asking a <strong>fair manager</strong> to help can lead to a peaceful solution."
      },
      {
        "q": "Is having close friends at work always positive?",
        "vi": "Có bạn thân ở nơi làm việc có luôn tốt không?",
        "a": "While having close friends at work brings great <strong>emotional support</strong>, it can sometimes cause <strong>too much chatting</strong> or feelings of <strong>unfair treatment</strong>. Therefore, workers should keep personal friendships separate from serious work decisions."
      },
      {
        "q": "What can a company do to build a friendly work culture?",
        "vi": "Công ty có thể làm gì để xây dựng văn hóa thân thiện?",
        "a": "Companies can organize fun social activities like <strong>monthly team lunches</strong>, birthday celebrations, or <strong>yearly company trips</strong>. Designing <strong>shared break rooms</strong> also gives staff from different teams natural chances to talk and connect."
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
        "vi": "Thư giãn"
      },
      {
        "num": 2,
        "text": "Widen knowledge",
        "pos": "right",
        "type": "verb",
        "vi": "Mở rộng kiến thức"
      },
      {
        "num": 3,
        "text": "Improve vocabulary",
        "pos": "bottom",
        "type": "verb",
        "vi": "Nâng cao vốn từ vựng"
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
        "a": "Personally, I prefer <strong>paper books</strong> because holding real pages feels much more <strong>calm and enjoyable</strong>. Also, reading printed books <strong>protects my eyes</strong> from bright screens and keeps me away from phone messages."
      },
      {
        "q": "How can parents encourage kids to read more?",
        "vi": "Làm sao cha mẹ khuyến khích con đọc sách?",
        "a": "Parents can set a <strong>good example</strong> by reading books at home instead of scrolling on phones. Buying <strong>colorful storybooks</strong> and reading together before bedtime also makes children <strong>love reading</strong> from an early age."
      },
      {
        "q": "Why do some people read less nowadays?",
        "vi": "Tại sao ngày nay nhiều người ít đọc sách?",
        "a": "Many people read less because they spend hours watching <strong>short, fast videos</strong> on social media. Compared to quick clips, reading long book pages can feel <strong>much slower</strong> and require <strong>more patience</strong>."
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
        "vi": "Cải thiện y tế và chăm sóc sức khỏe"
      },
      {
        "num": 2,
        "text": "Facilitate teaching and learning",
        "pos": "right",
        "type": "verb",
        "vi": "Hỗ trợ việc dạy và học"
      },
      {
        "num": 3,
        "text": "Handle daily tasks",
        "pos": "bottom",
        "type": "verb",
        "vi": "Xử lý các công việc hàng ngày"
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
        "a": "While AI will certainly take over some <strong>simple, repeated jobs</strong>, it also creates <strong>new tech roles</strong> in managing data and guiding AI tools. Therefore, workers need to <strong>learn new skills</strong> and adapt to using technology."
      },
      {
        "q": "How do you use AI in your daily study or work?",
        "vi": "Bạn dùng AI trong học tập thế nào?",
        "a": "I often use AI apps to <strong>check grammar mistakes</strong> in my English writing and <strong>brainstorm fresh ideas</strong>. Asking AI to <strong>turn long articles into short notes</strong> also saves me a lot of study time."
      },
      {
        "q": "What ethical risks come with AI development?",
        "vi": "Nguy cơ đạo đức nào đi kèm với AI?",
        "a": "Serious worries include <strong>using personal information</strong> without permission and producing <strong>unfair or wrong answers</strong>. Besides, realistic fake videos can easily <strong>spread false news</strong> and trick ordinary people."
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
        "text": "Make time for hobbies",
        "pos": "top",
        "type": "verb",
        "vi": "Dành thời gian cho sở thích"
      },
      {
        "num": 2,
        "text": "Build personal relationships",
        "pos": "right",
        "type": "verb",
        "vi": "Xây dựng các mối quan hệ cá nhân"
      },
      {
        "num": 3,
        "text": "Have time to relax",
        "pos": "bottom",
        "type": "verb",
        "vi": "Có thời gian thư giãn"
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
        "vi": "Tại sao cân bằng công việc và cuộc sống lại khó ở thành phố?",
        "a": "Keeping this balance in <strong>big cities</strong> is hard because of <strong>strong job competition</strong>, long hours stuck in traffic, and <strong>high living costs</strong>. With phones always ringing, workers also feel pressured to answer work messages late at night."
      },
      {
        "q": "What happens if someone ignores work-life balance?",
        "vi": "Chuyện gì xảy ra nếu bỏ qua sự cân bằng này?",
        "a": "Working too much without rest often leads to <strong>serious tiredness</strong>, poor sleep, and <strong>more health problems</strong>. Over time, people can also lose close family connections and start making mistakes at work."
      },
      {
        "q": "How can employers support their workers' balance?",
        "vi": "Doanh nghiệp hỗ trợ nhân viên cân bằng bằng cách nào?",
        "a": "Companies can offer <strong>flexible work hours</strong> and avoid giving extra tasks during weekends. Providing helpful perks like <strong>free gym passes</strong> or mental health support also shows true care for workers."
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
        "vi": "Khám phá các nền văn hóa khác nhau"
      },
      {
        "num": 2,
        "text": "Make new friends",
        "pos": "right",
        "type": "verb",
        "vi": "Kết bạn mới"
      },
      {
        "num": 3,
        "text": "Reduce stress",
        "pos": "bottom",
        "type": "verb",
        "vi": "Giảm căng thẳng"
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
        "a": "Personally, I prefer traveling with a <strong>small group of friends</strong> because sharing meals and taking fun photos makes the trip <strong>much more memorable</strong>. Traveling together is also safer and helps everyone <strong>save money</strong> on rooms and taxis."
      },
      {
        "q": "Is eco-tourism becoming more popular?",
        "vi": "Du lịch sinh thái có đang phổ biến không?",
        "a": "Yes, nature travel is getting very popular because people care more about <strong>protecting wildlife</strong> and supporting <strong>local villages</strong>. Many travelers now enjoy peaceful nature trips instead of crowded tourist hotels."
      },
      {
        "q": "What should travelers prepare before visiting another country?",
        "vi": "Cần chuẩn bị gì trước chuyến đi nước ngoài?",
        "a": "Travelers should make sure their <strong>passport is valid</strong>, change some <strong>local cash</strong>, and buy basic travel insurance. Learning a bit about <strong>local customs</strong> and rules also helps them avoid awkward mistakes."
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
        "vi": "Thể hiện lòng biết ơn và trân trọng cuộc sống"
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
        "text": "Acquire useful skills",
        "pos": "bottom",
        "type": "verb",
        "vi": "Tiếp thu các kỹ năng hữu ích"
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
        "a": "I think schools should <strong>strongly encourage</strong> volunteering rather than force everyone to go. When students join out of <strong>real care</strong>, the experience feels <strong>truly meaningful</strong> instead of like homework."
      },
      {
        "q": "How can people help the needy besides donating money?",
        "vi": "Giúp người khó khăn bằng cách nào ngoài tiền?",
        "a": "People can give their free time to <strong>teach poor children</strong> or cook warm meals at local shelters. Donating <strong>clean old clothes</strong>, warm blankets, or school books also brings real help to families in need."
      },
      {
        "q": "Have you ever participated in a charity project?",
        "vi": "Bạn đã từng tham gia hoạt động từ thiện nào chưa?",
        "a": "Yes, I once joined a school trip to bring <strong>warm coats</strong> and notebooks to kids in a mountain village. Seeing their <strong>happy smiles</strong> taught me how much a small act of sharing can mean."
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
        "vi": "Không tốn kém / Tiết kiệm"
      },
      {
        "num": 2,
        "text": "Relax",
        "pos": "right",
        "type": "verb",
        "vi": "Thư giãn"
      },
      {
        "num": 3,
        "text": "Safety",
        "pos": "bottom",
        "type": "noun",
        "vi": "An toàn"
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
        "a": "People can enjoy a <strong>family barbecue</strong>, watch a fun movie series together, or try <strong>cooking new dishes</strong>. Cleaning and decorating the living room or finishing a good book can also feel <strong>very refreshing</strong>."
      },
      {
        "q": "Why do some people dislike staying at home on holidays?",
        "vi": "Tại sao vài người không thích ở nhà ngày lễ?",
        "a": "Some people get bored because staying in the <strong>same house</strong> can feel just like an ordinary weekend. They prefer the excitement of seeing <strong>new cities</strong>, taking nice photos, and tasting special local food."
      },
      {
        "q": "Is holiday traffic a big problem in your country?",
        "vi": "Giao thông ngày lễ có là vấn đề lớn không?",
        "a": "Yes, for sure. Heavy traffic during major holidays like Tet is a <strong>huge problem</strong> every year. Millions of people travel at the same time, causing <strong>long traffic jams</strong> that keep cars stuck on highways for hours."
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
        "vi": "Giàu kinh nghiệm hơn"
      },
      {
        "num": 2,
        "text": "More knowledgeable",
        "pos": "right",
        "type": "adj",
        "vi": "Hiểu biết sâu rộng hơn"
      },
      {
        "num": 3,
        "text": "More responsible",
        "pos": "bottom",
        "type": "adj",
        "vi": "Có trách nhiệm hơn"
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
        "a": "Young leaders are usually more energetic, <strong>good with technology</strong>, and open to <strong>new business ideas</strong>. Their fresh mindset helps them connect well with younger staff and try modern ways of working."
      },
      {
        "q": "Should there be an age limit for political leaders?",
        "vi": "Có nên giới hạn tuổi cho lãnh đạo chính trị không?",
        "a": "I think having a reasonable <strong>retirement age</strong> helps bring <strong>younger voices</strong> and fresh energy into leadership. However, the rules should still be flexible enough to keep <strong>experienced leaders</strong> who stay healthy and <strong>mentally active</strong>."
      },
      {
        "q": "What makes a truly inspiring leader?",
        "vi": "Điều gì tạo nên một nhà lãnh đạo truyền cảm hứng?",
        "a": "A great leader is someone who sets a <strong>good example</strong> and listens to team members with <strong>real respect</strong>. Instead of just giving orders, they trust their workers and help everyone grow together."
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
        "vi": "Thiếu trải nghiệm mua sắm thực tế"
      },
      {
        "num": 3,
        "text": "Unexpected quality",
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
        "a": "Shoppers should only buy from <strong>trusted websites</strong> and sellers with <strong>official shop badges</strong>. Reading <strong>real buyer reviews</strong> and checking return rules carefully before paying also protects their money."
      },
      {
        "q": "Will online stores completely replace traditional shopping malls?",
        "vi": "Cửa hàng online có thay thế hoàn toàn trung tâm thương mại?",
        "a": "No, I do not think online stores will <strong>completely replace</strong> shopping malls because going out to shop is still a fun <strong>social activity</strong>. Malls give people nice places to walk around with friends, eat out, and enjoy entertainment."
      },
      {
        "q": "What should you do if an online order arrives damaged?",
        "vi": "Nên làm gì khi hàng online bị hư hỏng?",
        "a": "Buyers should take <strong>clear photos</strong> or <strong>videos</strong> of the broken item as soon as they open the box. Then they can message <strong>customer support</strong> right away to ask for a <strong>new item</strong> or a <strong>full refund</strong>."
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
        "vi": "Mất nhiều thời gian"
      },
      {
        "num": 2,
        "text": "Be very crowded",
        "pos": "right",
        "type": "verb",
        "vi": "Rất đông đúc"
      },
      {
        "num": 3,
        "text": "Be victims of criminal acts",
        "pos": "bottom",
        "type": "verb",
        "vi": "Có nguy cơ là nạn nhân của tội phạm"
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
        "a": "The government can offer <strong>cheap monthly passes</strong> and student discounts to <strong>help people save money</strong>. Building <strong>special bus lanes</strong> also helps buses run faster and stay right on time."
      },
      {
        "q": "Is public transport eco-friendly?",
        "vi": "Phương tiện công cộng có thân thiện môi trường không?",
        "a": "Yes, modern buses and metros are much <strong>greener than private cars</strong>. Carrying dozens of people on one ride greatly cuts down <strong>city air pollution</strong> and reduces <strong>traffic jams</strong>."
      },
      {
        "q": "Do you prefer traveling by motorbike or by bus?",
        "vi": "Bạn thích đi xe máy hay xe buýt?",
        "a": "I prefer taking the bus on <strong>rainy days</strong> because it keeps me dry and feels <strong>much safer</strong>. However, for quick short trips, riding a motorbike gives me more <strong>freedom in small streets</strong>."
      }
    ]
  },
  {
    "id": "d-topic-03",
    "category": "drawbacks",
    "categoryName": "Nhóm Bất Lợi",
    "topicCode": "ĐỀ SỐ 03",
    "title": "There are some drawbacks of doing exercise.",
    "center": "Doing exercise",
    "branches": [
      {
        "num": 1,
        "text": "Waste time",
        "pos": "top",
        "type": "verb",
        "vi": "Lãng phí thời gian"
      },
      {
        "num": 2,
        "text": "Waste money",
        "pos": "right",
        "type": "verb",
        "vi": "Lãng phí tiền bạc"
      },
      {
        "num": 3,
        "text": "Get injured",
        "pos": "bottom",
        "type": "verb",
        "vi": "Bị chấn thương"
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
        "a": "People should always do a <strong>simple warm-up</strong> before starting any <strong>hard workout</strong>. Using safe shoes and learning the <strong>right body form</strong> from the beginning also prevents painful accidents."
      },
      {
        "q": "Is going to an expensive gym necessary to stay fit?",
        "vi": "Có cần đến phòng gym đắt tiền không?",
        "a": "No, joining an <strong>expensive gym</strong> is not necessary at all because people can <strong>go jogging in parks</strong> or do simple home workouts. Exercising <strong>on a regular basis</strong> matters much more than fancy machines."
      },
      {
        "q": "How many hours of exercise per week is enough for adults?",
        "vi": "Người lớn nên tập bao nhiêu giờ mỗi tuần?",
        "a": "<strong>Doctors</strong> usually suggest around <strong>150 minutes</strong> of light or moderate exercise each week. Doing about <strong>thirty minutes a day</strong> five times a week is great for keeping the heart strong and healthy."
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
        "text": "Financial burden",
        "pos": "top",
        "type": "noun",
        "vi": "Gánh nặng tài chính"
      },
      {
        "num": 2,
        "text": "Lack of benefits",
        "pos": "right",
        "type": "noun",
        "vi": "Thiếu các chế độ bảo hiểm, đãi ngộ"
      },
      {
        "num": 3,
        "text": "Increased responsibility",
        "pos": "bottom",
        "type": "noun",
        "vi": "Trách nhiệm nặng nề hơn"
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
        "a": "Yes, working for yourself gives people much <strong>more freedom</strong> to decide their own <strong>work hours</strong> and <strong>ideas</strong>. If business owners keep trying through hard months, they can earn good money and feel proud of their work."
      },
      {
        "q": "Should students choose self-employment or work for a company after graduation?",
        "vi": "Sinh viên nên tự kinh doanh hay đi làm công ty?",
        "a": "New graduates should probably work at a <strong>good company first</strong> to learn practical skills and <strong>meet useful contacts</strong>. Once they feel confident and ready, starting their own business becomes much safer."
      },
      {
        "q": "What skills are most important for self-employed entrepreneurs?",
        "vi": "Kỹ năng nào quan trọng nhất cho người tự kinh doanh?",
        "a": "Self-employed people mostly need <strong>strong self-discipline</strong> and good skills in <strong>managing their money</strong>. Knowing how to talk clearly with customers also helps them keep <strong>regular customers</strong>."
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
        "text": "Pet restriction",
        "pos": "top",
        "type": "noun",
        "vi": "Bị hạn chế nuôi thú cưng"
      },
      {
        "num": 2,
        "text": "Limited spaces",
        "pos": "right",
        "type": "noun",
        "vi": "Không gian hạn chế"
      },
      {
        "num": 3,
        "text": "Noise from neighbors",
        "pos": "bottom",
        "type": "noun",
        "vi": "Tiếng ồn từ hàng xóm"
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
        "a": "Young couples choose apartments because the prices are <strong>more affordable</strong> and buildings offer <strong>good 24-hour security</strong>. Having shops, gyms, and play areas right inside the building is also very convenient."
      },
      {
        "q": "How can apartment residents deal with noisy neighbors?",
        "vi": "Xử lý hàng xóm ồn ào thế nào?",
        "a": "Residents should start by having a <strong>polite, friendly talk</strong> to explain the noise problem gently. If nothing changes, telling the <strong>building managers</strong> helps make sure everyone follows <strong>noise rules</strong> fairly."
      },
      {
        "q": "Do you prefer a townhouse or a condominium?",
        "vi": "Bạn thích nhà phố hay chung cư?",
        "a": "I prefer living in a <strong>tall modern apartment</strong> because higher floors get <strong>cool fresh air</strong> and nice city views. Also, gated entrances with guards make buildings very safe for young children."
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
        "vi": "Quá phụ thuộc vào AI trong cuộc sống"
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
        "text": "The risk of receiving false or biased information",
        "pos": "bottom",
        "type": "noun",
        "vi": "Nguy cơ nhận thông tin sai lệch hoặc thiên vị"
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
        "a": "Students should first write their own <strong>simple outlines</strong> and first drafts before asking AI for help. Teachers can also use <strong>short spoken presentations</strong> in class to check what learners really know."
      },
      {
        "q": "Can AI replace human creativity in art and writing?",
        "vi": "AI có thay thế được sáng tạo nghệ thuật?",
        "a": "No, computer programs cannot replace <strong>real human creativity</strong> because machines do not have <strong>true feelings</strong> or <strong>life memories</strong>. Great art and writing always come from genuine human heart and experience."
      },
      {
        "q": "What should schools do about students using ChatGPT to do homework?",
        "vi": "Trường học nên làm gì khi học sinh dùng ChatGPT?",
        "a": "Schools should teach students to use AI as a <strong>helpful study tool</strong> instead of using it to cheat. Teachers can also ask learners to <strong>check AI facts</strong> so they learn to think carefully on their own."
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
        "vi": "Chịu ảnh hưởng từ phim ảnh, truyền thông"
      },
      {
        "num": 2,
        "text": "Have peer pressure",
        "pos": "right",
        "type": "verb",
        "vi": "Chịu áp lực từ bạn bè"
      },
      {
        "num": 3,
        "text": "Lack of parental supervision",
        "pos": "bottom",
        "type": "noun",
        "vi": "Thiếu sự giám sát của cha mẹ"
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
        "a": "Schools should set up a <strong>friendly support room</strong> where students can talk safely about problems early. Teaching <strong>kindness</strong> and <strong>anger control</strong> in regular lessons also helps teenagers solve arguments peacefully."
      },
      {
        "q": "Is cyberbullying among youth becoming worse?",
        "vi": "Bạo lực mạng ở giới trẻ có đang tồi tệ hơn?",
        "a": "Yes, online bullying is getting worse because teenagers spend hours on <strong>social media apps</strong> every day. <strong>Hurtful messages</strong> or mean videos spread very fast online and can make young victims feel <strong>deeply lonely</strong>."
      },
      {
        "q": "What role do parents play in guiding aggressive teenagers?",
        "vi": "Vai trò của cha mẹ khi con cái bướng bỉnh?",
        "a": "Parents play a key role by staying close, listening patiently, and <strong>watching daily behavior</strong> calmly. Setting <strong>clear rules at home</strong> while showing real love guides hot-tempered teens in the right direction."
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
        "vi": "Gần gũi với con cái hơn"
      },
      {
        "num": 2,
        "text": "Teach them with love and responsibility",
        "pos": "right",
        "type": "verb",
        "vi": "Dạy dỗ con bằng tình thương và trách nhiệm"
      },
      {
        "num": 3,
        "text": "Understand the strengths and weaknesses",
        "pos": "bottom",
        "type": "verb",
        "vi": "Thấu hiểu điểm mạnh và điểm yếu của con"
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
        "a": "Parents should first teach kids to be <strong>honest</strong>, <strong>polite</strong>, and <strong>kind</strong> to people around them. Building <strong>good basic manners</strong> early helps children make good friends and settle well at school."
      },
      {
        "q": "Can parents sometimes teach their children bad habits?",
        "vi": "Cha mẹ có thể vô tình dạy con thói quen xấu?",
        "a": "Yes, children learn by watching adults closely every day. If parents lose their temper easily or stay glued to <strong>phone screens</strong> at dinner, their kids are very likely to <strong>copy those same habits</strong>."
      },
      {
        "q": "Who has a stronger influence on teenagers: parents or teachers?",
        "vi": "Cha mẹ hay thầy cô có ảnh hưởng lớn hơn?",
        "a": "I believe parents still have the stronger influence because they <strong>know their children</strong> deeply and live with them for years. Still, caring teachers also inspire teenagers a lot in <strong>learning</strong> and <strong>future goals</strong>."
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
        "text": "Parents’ expectation",
        "pos": "top",
        "type": "noun",
        "vi": "Kỳ vọng của cha mẹ"
      },
      {
        "num": 2,
        "text": "Peer competition",
        "pos": "right",
        "type": "noun",
        "vi": "Sự cạnh tranh từ bạn bè"
      },
      {
        "num": 3,
        "text": "Heavy workload",
        "pos": "bottom",
        "type": "noun",
        "vi": "Khối lượng bài vở nặng nề"
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
        "a": "Schools can replace heavy final exams with <strong>regular class projects</strong> and group tasks. Cutting down <strong>daily homework loads</strong> and running fun after-school clubs also helps students feel much more relaxed."
      },
      {
        "q": "What should parents do when their child gets low grades?",
        "vi": "Cha mẹ nên làm gì khi con bị điểm kém?",
        "a": "Parents should stay patient and offer <strong>warm encouragement</strong> instead of shouting or blaming. Sitting down calmly to check mistakes together helps kids regain <strong>study confidence</strong>."
      },
      {
        "q": "Can physical sports relieve study stress?",
        "vi": "Thể thao có giúp giảm căng thẳng học tập?",
        "a": "Yes, playing sports is one of the best ways to <strong>reduce stress</strong>. Exercise helps the mind <strong>forget school worries</strong> for a while and improves mood, helping students <strong>sleep better</strong> and focus again."
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
        "vi": "Kỹ năng giao tiếp tốt"
      },
      {
        "num": 2,
        "text": "Effective teamwork skills",
        "pos": "right",
        "type": "noun",
        "vi": "Kỹ năng làm việc nhóm hiệu quả"
      },
      {
        "num": 3,
        "text": "The ability to multitask",
        "pos": "bottom",
        "type": "noun",
        "vi": "Khả năng xử lý nhiều việc cùng lúc"
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
        "a": "In general, men often prefer quick <strong>direct decisions</strong>, while many female leaders focus on <strong>careful listening</strong> and team unity. Both styles have good points, and great leaders mix confidence with kindness."
      },
      {
        "q": "What is the biggest barrier for women aiming for executive roles?",
        "vi": "Rào cản lớn nhất của phụ nữ khi lên lãnh đạo?",
        "a": "Many women still face <strong>unfair ideas</strong> at work and heavier pressure to handle <strong>housework</strong> and <strong>childcare</strong> alone. Balancing career goals with family needs takes great effort and strong company support."
      },
      {
        "q": "How can companies foster gender equality?",
        "vi": "Doanh nghiệp thúc đẩy bình đẳng giới thế nào?",
        "a": "Companies can offer <strong>leadership training programs</strong> for women and allow <strong>flexible work hours</strong> for parents. Paying equal salaries for the same job also builds real workplace fairness."
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
        "text": "Study/Work burnout",
        "pos": "top",
        "type": "noun",
        "vi": "Kiệt sức do học tập hoặc công việc"
      },
      {
        "num": 2,
        "text": "Poor financial situation",
        "pos": "right",
        "type": "noun",
        "vi": "Tình hình tài chính khó khăn"
      },
      {
        "num": 3,
        "text": "Relationship problems",
        "pos": "bottom",
        "type": "noun",
        "vi": "Vấn đề trong các mối quan hệ"
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
        "vi": "Dấu hiệu sớm của stress kéo dài?",
        "a": "Early signs often include feeling <strong>tired all the time</strong>, getting angry easily, and having trouble <strong>sleeping well at night</strong>. Some people also get frequent headaches or struggle to focus at work."
      },
      {
        "q": "Can talking to a friend relieve stress?",
        "vi": "Tâm sự với bạn bè có giảm stress?",
        "a": "Yes, opening up to a <strong>trusted friend</strong> helps a lot because sharing worries makes problems feel smaller. Good friends listen with care, cheer people up, and sometimes offer <strong>helpful practical ideas</strong>."
      },
      {
        "q": "When should someone seek professional therapy?",
        "vi": "Khi nào nên gặp chuyên gia tâm lý?",
        "a": "Someone should talk to a doctor or counselor if strong sadness and worry <strong>last for weeks</strong> and hurt daily life. Getting early <strong>professional support</strong> is a smart way to protect mental health."
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
        "text": "Unhealthy eating habits",
        "pos": "top",
        "type": "noun",
        "vi": "Thói quen ăn uống không lành mạnh"
      },
      {
        "num": 2,
        "text": "Excessive mobile phone use",
        "pos": "right",
        "type": "noun",
        "vi": "Sử dụng điện thoại quá nhiều"
      },
      {
        "num": 3,
        "text": "Lack of physical exercise",
        "pos": "bottom",
        "type": "noun",
        "vi": "Thiếu vận động thể chất"
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
        "a": "Yes, banning sugary drinks and sweets at school canteens helps protect <strong>children’s daily health</strong>. Offering fresh fruit, milk, and <strong>healthy snacks</strong> instead guides students toward better food choices."
      },
      {
        "q": "What health issues can obese children face later in life?",
        "vi": "Trẻ béo phì đối mặt nguy cơ gì sau này?",
        "a": "Overweight children have a higher chance of getting <strong>heart problems</strong>, diabetes, and <strong>painful joints</strong> when they grow up. Being very heavy can also lower their confidence around school friends."
      },
      {
        "q": "How can families create an active lifestyle together?",
        "vi": "Gia đình làm sao để cùng nhau vận động?",
        "a": "Families can build good habits by <strong>walking after dinner</strong>, riding bicycles together on weekends, or going swimming. Turning physical exercise into <strong>fun family time</strong> keeps everyone active and happy."
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
        "text": "Share with someone else",
        "pos": "top",
        "type": "verb",
        "vi": "Tâm sự với người khác"
      },
      {
        "num": 2,
        "text": "Listen to music",
        "pos": "right",
        "type": "verb",
        "vi": "Nghe nhạc"
      },
      {
        "num": 3,
        "text": "Do exercise",
        "pos": "bottom",
        "type": "verb",
        "vi": "Tập thể dục"
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
        "a": "Yes, having a <strong>good cry</strong> helps release stress and stop <strong>sad emotions</strong> from building up inside. Most people feel noticeably calmer and clearer in their mind right afterward."
      },
      {
        "q": "What should you do when a friend feels deeply sad?",
        "vi": "Nên làm gì khi bạn bè buồn bã?",
        "a": "Friends should show <strong>warm support</strong> by listening patiently without rushing to lecture or judge. Sometimes simply sitting together, watching a movie, or <strong>going for coffee</strong> helps a lot."
      },
      {
        "q": "Can spending time in nature improve mental health?",
        "vi": "Hòa mình vào thiên nhiên có cải thiện tâm trạng?",
        "a": "Yes, getting out into <strong>green parks</strong> or quiet beaches works wonders for mental health. Fresh air, sunlight, and gentle walking naturally lower stress and bring back a <strong>calm</strong>, <strong>hopeful mood</strong>."
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
        "vi": "Xây dựng kỹ năng giao tiếp hiệu quả"
      },
      {
        "num": 2,
        "text": "Keep good co-operation",
        "pos": "right",
        "type": "verb",
        "vi": "Duy trì sự hợp tác tốt"
      },
      {
        "num": 3,
        "text": "Avoid criticism and gossip",
        "pos": "bottom",
        "type": "verb",
        "vi": "Tránh chỉ trích và bàn tán"
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
        "a": "Talking behind coworkers’ backs quickly <strong>breaks team trust</strong> and makes the office feel tense and unfriendly. People spend time worrying about rumors instead of focusing on <strong>important work tasks</strong>."
      },
      {
        "q": "How can introverted workers build rapport with team members?",
        "vi": "Người hướng nội kết nối với đồng nghiệp thế nào?",
        "a": "Quiet workers can start with <strong>small friendly steps</strong> like smiling in the morning, eating lunch with one or two teammates, or sending helpful notes. Being a <strong>reliable listener</strong> naturally earns coworkers’ respect."
      },
      {
        "q": "Should managers socialize with employees after work?",
        "vi": "Sếp có nên đi chơi với nhân viên sau giờ làm?",
        "a": "Yes, joining <strong>casual team dinners</strong> or coffee breaks now and then helps bosses and staff understand one another better. Keeping it relaxed while staying <strong>fair at work</strong> makes the whole team closer."
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
        "type": "noun",
        "vi": "Đúng giờ"
      },
      {
        "num": 2,
        "text": "Being well-dressed",
        "pos": "right",
        "type": "noun",
        "vi": "Ăn mặc lịch sự, chỉn chu"
      },
      {
        "num": 3,
        "text": "Being humorous",
        "pos": "bottom",
        "type": "noun",
        "vi": "Hài hước, tự nhiên"
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
        "a": "Candidates can ask about <strong>daily job duties</strong>, team working style, or what skills help a new worker succeed in the first few months. Asking smart questions shows <strong>real interest</strong> in the company."
      },
      {
        "q": "How can candidates calm interview nerves?",
        "vi": "Làm sao giữ bình tĩnh trước phỏng vấn?",
        "a": "Job seekers can feel calmer by practicing <strong>common answers at home</strong>, sleeping well the night before, and taking slow <strong>deep breaths</strong> before walking in. Arriving a bit early also removes unnecessary rush."
      },
      {
        "q": "Is sending a thank-you email after the interview recommended?",
        "vi": "Có nên gửi email cảm ơn sau phỏng vấn?",
        "a": "Yes, writing a short, polite thank-you note within a day is a <strong>very good habit</strong>. It reminds interviewers of the candidate’s name and shows <strong>good manners</strong> and <strong>excitement about the job</strong>."
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
        "text": "Do exercise",
        "pos": "top",
        "type": "verb",
        "vi": "Tập thể dục"
      },
      {
        "num": 2,
        "text": "Manage stress",
        "pos": "right",
        "type": "verb",
        "vi": "Kiểm soát căng thẳng"
      },
      {
        "num": 3,
        "text": "Eat healthy food",
        "pos": "bottom",
        "type": "verb",
        "vi": "Ăn uống lành mạnh"
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
        "a": "Drinking plenty of water every day keeps the body <strong>fresh</strong> and <strong>active</strong>, helps digest food smoothly, and stops headaches or tiredness. Without enough water, people quickly feel <strong>tired</strong> and find it harder to focus."
      },
      {
        "q": "How many hours of sleep do adults need per night?",
        "vi": "Người lớn cần ngủ bao nhiêu tiếng mỗi đêm?",
        "a": "Most adults need around <strong>seven to eight hours</strong> of good sleep every night. Getting enough rest gives the brain and muscles time to <strong>recover properly</strong> for the next busy day."
      },
      {
        "q": "Is mental health as important as physical health?",
        "vi": "Sức khỏe tinh thần có quan trọng như thể chất?",
        "a": "Yes, mental health is <strong>just as important</strong> as <strong>physical health</strong> because stress and sadness affect everything people do. When people feel happy and calm inside, they sleep better, get sick less, and enjoy life more."
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
        "vi": "Tập luyện thể chất"
      },
      {
        "num": 2,
        "text": "Talk to someone",
        "pos": "right",
        "type": "verb",
        "vi": "Tâm sự với ai đó"
      },
      {
        "num": 3,
        "text": "Take a short break",
        "pos": "bottom",
        "type": "verb",
        "vi": "Nghỉ ngơi ngắn"
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
        "a": "Yes, spending even ten minutes sitting quietly and <strong>breathing slowly</strong> calms racing thoughts right away. Regular meditation trains the mind to stay steady when facing <strong>busy</strong> or <strong>hard days</strong>."
      },
      {
        "q": "Can listening to instrumental music help people relax?",
        "vi": "Nhạc không lời có giúp thư giãn?",
        "a": "Yes, soft piano, guitar, or nature sounds help the mind slow down after noisy hours at school or work. Because there are no distracting lyrics, <strong>calm instrumental music</strong> is great for relaxing or studying."
      },
      {
        "q": "Why is taking short breaks during work crucial?",
        "vi": "Tại sao nghỉ giải lao ngắn là cần thiết?",
        "a": "Short breaks give tired eyes and an overworked brain a chance to <strong>rest</strong> and <strong>reset</strong>. Even standing up to stretch for five minutes stops burnout and helps workers return with <strong>clearer focus</strong>."
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
        "vi": "Tự nấu ăn tại nhà"
      },
      {
        "num": 2,
        "text": "Avoid unnecessary shopping",
        "pos": "right",
        "type": "verb",
        "vi": "Tránh mua sắm không cần thiết"
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
        "a": "Many students struggle because living costs in big cities are high while part-time pay is small. Also, tempting ads for <strong>milk tea</strong>, dining out, and <strong>online sales</strong> make it easy to overspend."
      },
      {
        "q": "Should students buy second-hand textbooks?",
        "vi": "Sinh viên có nên mua giáo trình cũ?",
        "a": "Yes, buying <strong>used textbooks</strong> from older students or borrowing from the campus library is a smart move. Since college books are quite pricey and often only used for one term, second-hand copies save a <strong>lot of cash</strong>."
      },
      {
        "q": "How can student discounts help with monthly budgets?",
        "vi": "Ưu đãi sinh viên giúp gì cho ngân sách?",
        "a": "Student ID cards often give <strong>cheaper bus tickets</strong>, lower movie prices, and special shop deals every week. Using these small discounts regularly adds up to <strong>useful monthly savings</strong>."
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
        "text": "Add more useful books and resources",
        "pos": "top",
        "type": "verb",
        "vi": "Bổ sung thêm sách và tài liệu hữu ích"
      },
      {
        "num": 2,
        "text": "Provide digital materials and computers",
        "pos": "right",
        "type": "verb",
        "vi": "Cung cấp tài liệu số và máy tính"
      },
      {
        "num": 3,
        "text": "Create a more comfortable reading space",
        "pos": "bottom",
        "type": "verb",
        "vi": "Tạo không gian đọc sách thoải mái hơn"
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
        "a": "Libraries can organize fun <strong>reading clubs</strong>, quiet study workshops, and display popular new novels near the entrance. Adding fast Wi-Fi and <strong>comfortable seating</strong> also encourages students to spend time there."
      },
      {
        "q": "Are physical libraries still needed in the internet age?",
        "vi": "Thời đại internet có còn cần thư viện?",
        "a": "Yes, physical libraries are still very useful because they offer a <strong>quiet place</strong> to focus away from noisy dorms and homes. Students also get free access to <strong>reliable books</strong> and helpful librarians."
      },
      {
        "q": "Should food and drinks be allowed in school libraries?",
        "vi": "Có nên cho phép đồ ăn trong thư viện?",
        "a": "Hot meals or sticky snacks should stay out because spills can ruin expensive books and bother other readers. However, letting students bring <strong>closed water bottles</strong> is totally fine and keeps learners comfortable."
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
        "vi": "Đọc thêm sách lịch sử"
      },
      {
        "num": 2,
        "text": "Listen to historical stories",
        "pos": "right",
        "type": "verb",
        "vi": "Lắng nghe các câu chuyện lịch sử"
      },
      {
        "num": 3,
        "text": "Watch historical documentaries or films",
        "pos": "bottom",
        "type": "verb",
        "vi": "Xem phim tài liệu hoặc phim lịch sử"
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
        "a": "Many students get bored because history classes often focus too much on <strong>memorizing dates</strong> and long names instead of telling exciting stories. Without fun discussions or videos, past events feel distant from daily life."
      },
      {
        "q": "How can visiting museums make history more exciting?",
        "vi": "Tham quan bảo tàng giúp học lịch sử thế nào?",
        "a": "Going to museums lets students see <strong>real old objects</strong>, traditional clothes, and historic photos right in front of them. Touching or seeing actual items turns textbook lines into <strong>lasting memories</strong>."
      },
      {
        "q": "Why is learning history important for every citizen?",
        "vi": "Tại sao học lịch sử quan trọng với mọi công dân?",
        "a": "Learning history helps people understand their <strong>country’s roots</strong> and feel proud of past generations. Knowing what worked or failed before also teaches society to make <strong>wiser choices</strong> today and in the future."
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
        "text": "Make phone calls",
        "pos": "top",
        "type": "verb",
        "vi": "Gọi điện thoại"
      },
      {
        "num": 2,
        "text": "Meet in person",
        "pos": "right",
        "type": "verb",
        "vi": "Gặp mặt trực tiếp"
      },
      {
        "num": 3,
        "text": "Write letters or messages",
        "pos": "bottom",
        "type": "verb",
        "vi": "Viết thư hoặc gửi tin nhắn"
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
        "a": "Social apps make it super fast and cheap to chat with friends and relatives across <strong>different countries</strong>. Sharing photos and quick daily updates helps people stay close even across <strong>different time zones</strong>."
      },
      {
        "q": "Do you prefer calling or texting?",
        "vi": "Bạn thích gọi điện hay nhắn tin?",
        "a": "For quick everyday plans, I prefer <strong>sending text messages</strong> because people can answer whenever they are free. However, when talking to close family or sharing big news, a <strong>voice call</strong> or <strong>video call</strong> feels much warmer."
      },
      {
        "q": "Why is face-to-face communication still the best?",
        "vi": "Tại sao gặp mặt trực tiếp vẫn là tốt nhất?",
        "a": "Meeting in person lets people see real smiles, hear warm laughter, and enjoy <strong>shared activities</strong> like eating together. Screens are convenient, yet nothing beats the <strong>real closeness</strong> of sitting across from someone you care about."
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
        "text": "Share some routines & household tasks",
        "pos": "top",
        "type": "verb",
        "vi": "Chia sẻ sinh hoạt & việc nhà"
      },
      {
        "num": 2,
        "text": "Childcare responsibility",
        "pos": "right",
        "type": "noun",
        "vi": "Trách nhiệm chăm sóc con cái"
      },
      {
        "num": 3,
        "text": "Work as a team",
        "pos": "bottom",
        "type": "verb",
        "vi": "Phối hợp như một đội"
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
        "a": "In the past ten years, both husbands and wives have started sharing <strong>earning money</strong> and <strong>doing housework</strong> much more equally. Modern men take an active part in cooking and raising kids rather than leaving everything to mothers."
      },
      {
        "q": "What roles do grandparents play in a family?",
        "vi": "Vai trò của ông bà trong gia đình?",
        "a": "Grandparents often help look after <strong>young grandchildren</strong> while parents are at work and teach kids lovely <strong>family traditions</strong>. Their love, patience, and life experience bring warmth to the whole home."
      },
      {
        "q": "What do you think about single-parent families?",
        "vi": "Bạn nghĩ gì về gia đình đơn thân?",
        "a": "Raising children alone takes <strong>amazing strength</strong> and daily hard work because one person carries both roles. With strong support from relatives and schools, single parents still raise <strong>happy</strong>, <strong>confident children</strong>."
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
        "text": "Creativity",
        "pos": "top",
        "type": "noun",
        "vi": "Sự sáng tạo"
      },
      {
        "num": 2,
        "text": "Responsibility",
        "pos": "right",
        "type": "noun",
        "vi": "Tinh thần trách nhiệm"
      },
      {
        "num": 3,
        "text": "Have many skills",
        "pos": "bottom",
        "type": "verb",
        "vi": "Có nhiều kỹ năng đa dạng"
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
        "a": "Technology and work styles change very fast nowadays, so workers must <strong>learn new tools</strong> quickly. Being flexible helps employees stay useful, handle new tasks smoothly, and protect their <strong>long-term career</strong>."
      },
      {
        "q": "Can someone improve their problem-solving skills?",
        "vi": "Có thể cải thiện kỹ năng giải quyết vấn đề?",
        "a": "Yes, definitely. Anyone can get better at solving problems by <strong>staying calm</strong> when things go wrong, asking smart questions, and learning from <strong>real work challenges</strong> every day."
      },
      {
        "q": "What is more valuable: technical skills or a positive work attitude?",
        "vi": "Kỹ năng chuyên môn hay thái độ tích cực quan trọng hơn?",
        "a": "Both matter a lot, yet a <strong>positive work attitude</strong> often comes first because hard workers are always willing to learn new skills. Friendly and reliable staff help build a <strong>stronger</strong>, <strong>happier team</strong>."
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
        "text": "Give helpful advice",
        "pos": "top",
        "type": "verb",
        "vi": "Đưa ra lời khuyên hữu ích"
      },
      {
        "num": 2,
        "text": "Listen and keep your secrets",
        "pos": "right",
        "type": "verb",
        "vi": "Lắng nghe và giữ bí mật"
      },
      {
        "num": 3,
        "text": "Point out your mistakes",
        "pos": "bottom",
        "type": "verb",
        "vi": "Chỉ ra lỗi sai cho bạn"
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
        "a": "Friends living in different cities can keep in touch by <strong>chatting online regularly</strong>, remembering birthdays, and calling to share big news. Planning a meet-up whenever free keeps the bond <strong>strong</strong> and <strong>lively</strong>."
      },
      {
        "q": "Is having a few true friends better than having many acquaintances?",
        "vi": "Ít bạn thân tốt hơn nhiều bạn xã giao?",
        "a": "Yes, having a few loyal close friends is far more meaningful than having hundreds of <strong>casual online contacts</strong>. Close friends truly care and show up when help is needed most."
      },
      {
        "q": "What should you do if a friend betrays your trust?",
        "vi": "Nên làm gì khi bạn bè phản bội lòng tin?",
        "a": "Forgiving small mistakes is normal, yet if someone breaks trust <strong>on purpose</strong>, it is better to talk openly and step back if needed. Protecting one’s peace of mind allows time for <strong>healthier friendships</strong>."
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
        "text": "Responsibility",
        "pos": "top",
        "type": "noun",
        "vi": "Tinh thần trách nhiệm"
      },
      {
        "num": 2,
        "text": "Good communication skills",
        "pos": "right",
        "type": "noun",
        "vi": "Kỹ năng giao tiếp tốt"
      },
      {
        "num": 3,
        "text": "Be supportive",
        "pos": "bottom",
        "type": "adj",
        "vi": "Luôn hỗ trợ và động viên"
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
        "a": "Some people seem naturally confident, yet leadership can definitely be <strong>learned over time</strong>. Practicing public speaking, managing <strong>small student clubs</strong>, and guiding group projects slowly turn anyone into a strong leader."
      },
      {
        "q": "How should a leader handle team conflicts?",
        "vi": "Lãnh đạo nên xử lý mâu thuẫn nhóm thế nào?",
        "a": "A good leader should sit down privately with both sides and <strong>listen fairly</strong> without <strong>taking sides</strong>. Helping coworkers focus on the <strong>shared goal</strong> usually settles arguments calmly."
      },
      {
        "q": "What is the difference between a boss and a true leader?",
        "vi": "Khác biệt giữa một ông chủ và người lãnh đạo?",
        "a": "A strict boss mostly gives cold orders and blames workers when things fail, while a <strong>true leader</strong> works side by side with the team. Leaders inspire people, teach skills, and share praise for <strong>group success</strong>."
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
        "text": "Be creative",
        "pos": "top",
        "type": "adj",
        "vi": "Sáng tạo trong giảng dạy"
      },
      {
        "num": 2,
        "text": "Be knowledgeable",
        "pos": "right",
        "type": "adj",
        "vi": "Am hiểu kiến thức sâu rộng"
      },
      {
        "num": 3,
        "text": "Be patient",
        "pos": "bottom",
        "type": "adj",
        "vi": "Kiên nhẫn với học sinh"
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
        "a": "My favorite teacher was my high school English teacher because she always made class <strong>fun</strong> and <strong>lively</strong>. She used games and real-life stories, and patiently helped shy students build <strong>confidence in speaking</strong>."
      },
      {
        "q": "Will computers ever replace human teachers?",
        "vi": "Máy tính có thể thay thế giáo viên?",
        "a": "No, computers can never replace human teachers because learning needs <strong>real human care</strong> and understanding. Apps can share facts fast, yet only teachers can cheer up tired learners and guide them with a <strong>warm heart</strong>."
      },
      {
        "q": "What is the hardest challenge modern teachers face?",
        "vi": "Thử thách lớn nhất của giáo viên hiện nay?",
        "a": "One of the biggest challenges today is keeping students focused when <strong>smartphones</strong> and <strong>social media</strong> easily distract them. Teachers also work under heavy pressure from large class sizes and <strong>strict exam targets</strong>."
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
        "text": "Eagerness to learn",
        "pos": "right",
        "type": "noun",
        "vi": "Sự ham học hỏi"
      },
      {
        "num": 3,
        "text": "Ability to manage time well",
        "pos": "bottom",
        "type": "noun",
        "vi": "Khả năng quản lý thời gian tốt"
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
        "a": "With smartphones and games everywhere today, self-discipline helps students put phones aside and finish <strong>daily homework first</strong>. Learners who manage themselves well stay on track even without teachers watching."
      },
      {
        "q": "Which is more important: high test scores or good character?",
        "vi": "Điểm số cao hay phẩm chất tốt quan trọng hơn?",
        "a": "Good test scores open school doors, yet <strong>good character</strong> like honesty and kindness matters much more over a lifetime. People with strong values are trusted by friends, respected at work, and happier overall."
      },
      {
        "q": "How can students improve their time management?",
        "vi": "Học sinh cải thiện quản lý thời gian thế nào?",
        "a": "Students can start by making a <strong>simple daily to-do list</strong> each morning and putting big tasks first. Breaking hard homework into short <strong>30-minute study blocks</strong> also keeps stress low and focus high."
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
        "text": "A friendly working environment",
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
        "a": "In my opinion, having a <strong>friendly workplace</strong> and <strong>room to grow</strong> matters most alongside fair pay. Even a high salary feels exhausting if a worker feels stressed and unhappy every single morning."
      },
      {
        "q": "Do young people and older people look for the same thing in a job?",
        "vi": "Người trẻ và lớn tuổi có tìm kiếm điều giống nhau?",
        "a": "Usually they have slightly different goals. Young workers often look for chances to <strong>learn new skills</strong> and move up fast, whereas older staff usually value <strong>job security</strong>, steady hours, and good health care."
      },
      {
        "q": "How can people find a job that is suitable for them?",
        "vi": "Làm thế nào để tìm được công việc phù hợp?",
        "a": "Job seekers should first list their <strong>strong skills</strong> and things they genuinely enjoy doing. Trying internships, asking friends in the field, and reading clear <strong>job details online</strong> also help them choose wisely."
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
        "vi": "Trang phục và diện mạo chuyên nghiệp"
      },
      {
        "num": 2,
        "text": "Punctuality",
        "pos": "right",
        "type": "noun",
        "vi": "Đúng giờ"
      },
      {
        "num": 3,
        "text": "Clear and confident communication",
        "pos": "bottom",
        "type": "noun",
        "vi": "Giao tiếp rõ ràng và tự tin"
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
        "a": "I think <strong>clear</strong>, <strong>honest communication</strong> is the most important factor because interviewers want to see how candidates think and talk. Explaining past projects smoothly with a confident smile shows real readiness for the role."
      },
      {
        "q": "Do you think first impressions are always accurate? Why or why not?",
        "vi": "Ấn tượng ban đầu có luôn chính xác không?",
        "a": "No, first impressions are not always right because some very talented people simply feel <strong>shy</strong> or <strong>nervous</strong> at the start. Managers still need to look at actual skills and work results before judging someone."
      },
      {
        "q": "What can people do if they make a bad first impression in an interview?",
        "vi": "Làm gì nếu lỡ tạo ấn tượng xấu ban đầu?",
        "a": "Candidates should stay calm, smile politely, and focus on giving <strong>strong</strong>, <strong>clear answers</strong> to the next questions. Showing eagerness to learn and asking thoughtful questions at the end can easily turn the talk around."
      }
    ]
  },
  {
    "id": "f-topic-03",
    "category": "factors",
    "categoryName": "Nhóm Yếu Tố",
    "topicCode": "TOPIC 03",
    "title": "There are several factors to consider when choosing a university.",
    "center": "Choosing a university",
    "branches": [
      {
        "num": 1,
        "text": "Tuition fees",
        "pos": "top",
        "type": "noun",
        "vi": "Học phí và chi phí sinh hoạt"
      },
      {
        "num": 2,
        "text": "Academic reputation",
        "pos": "right",
        "type": "noun",
        "vi": "Danh tiếng học thuật và giảng viên"
      },
      {
        "num": 3,
        "text": "Career prospects",
        "pos": "bottom",
        "type": "noun",
        "vi": "Cơ hội việc làm sau khi ra trường"
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
        "a": "In my opinion, <strong>future job chances</strong> matter the most because almost every student studies hard hoping to find a good job afterward. Picking a school with practical training and <strong>strong company links</strong> helps graduates get hired faster."
      },
      {
        "q": "Should high school students follow their parents' advice when selecting a college?",
        "vi": "Học sinh có nên nghe theo lời khuyên của cha mẹ khi chọn trường không?",
        "a": "Yes, teenagers should listen carefully to their parents since older family members have useful <strong>life experience</strong> and know family budgets well. Still, the final choice should follow the student’s own <strong>passions</strong> and <strong>strengths</strong>."
      },
      {
        "q": "Is graduating from a prestigious university the only way to achieve career success?",
        "vi": "Tốt nghiệp trường danh tiếng có phải là cách duy nhất để thành công trong sự nghiệp?",
        "a": "Not at all. While top university degrees help at the start, real <strong>practical experience</strong>, hard work, and <strong>good people skills</strong> decide long-term success much more."
      }
    ]
  },
  {
    "id": "b-topic-16",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 16",
    "title": "Having lunch at the school canteen has a lot of benefits.",
    "center": "Lunch at canteen",
    "branches": [
      {
        "num": 1,
        "text": "cheap",
        "pos": "top",
        "type": "adj",
        "vi": "Giá cả phải chăng, tiết kiệm"
      },
      {
        "num": 2,
        "text": "convenient",
        "pos": "right",
        "type": "adj",
        "vi": "Tiện lợi, không cần đi xa"
      },
      {
        "num": 3,
        "text": "time-saving",
        "pos": "bottom",
        "type": "adj",
        "vi": "Tiết kiệm thời gian nghỉ ngơi"
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
        "q": "How does a school attract more students to have lunch at its canteen?",
        "vi": "Làm thế nào để trường học thu hút nhiều học sinh ăn trưa tại căng tin hơn?",
        "a": "Schools can attract more students by <strong>improving both the nutritional quality and variety of food options</strong>. In addition, keeping prices reasonable and <strong>ensuring a clean, welcoming dining environment</strong> will make the canteen far more appealing."
      },
      {
        "q": "What are some disadvantages of eating at the canteen?",
        "vi": "Một số nhược điểm của việc ăn ở căng tin là gì?",
        "a": "One obvious disadvantage is that school canteens are <strong>often overcrowded, especially during peak lunch hours</strong>. Furthermore, the daily menu <strong>may become repetitive over time</strong>, which can make meals uninspiring for some students."
      },
      {
        "q": "What should schools do to have hygienic and healthy meals for students?",
        "vi": "Nhà trường nên làm gì để có những bữa ăn vệ sinh và lành mạnh cho học sinh?",
        "a": "Schools must <strong>strictly enforce food safety standards and regularly inspect ingredient sources</strong>. Additionally, <strong>employing certified kitchen staff and maintaining spotless hygiene</strong> are essential for protecting students' long-term health."
      }
    ]
  },
  {
    "id": "b-topic-17",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 17",
    "title": "There are some benefits of living alone for students.",
    "center": "Living alone",
    "branches": [
      {
        "num": 1,
        "text": "independent",
        "pos": "top",
        "type": "adj",
        "vi": "Rèn luyện tính tự lập"
      },
      {
        "num": 2,
        "text": "free",
        "pos": "right",
        "type": "adj",
        "vi": "Tự do giờ giấc và sinh hoạt"
      },
      {
        "num": 3,
        "text": "peaceful",
        "pos": "bottom",
        "type": "adj",
        "vi": "Không gian yên bình, không bị làm phiền"
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
        "q": "Is living alone popular among students? Why/ why not?",
        "vi": "Sống một mình có phổ biến ở sinh viên không? Tại sao / tại sao không?",
        "a": "Yes, it is <strong>increasingly popular among university students nowadays</strong>. Many young adults prioritize <strong>personal privacy, quiet study spaces, and freedom from roommate friction</strong>."
      },
      {
        "q": "What are the disadvantages of living alone?",
        "vi": "Những bất lợi của việc sống một mình là gì?",
        "a": "The primary drawback is the <strong>higher financial burden of rent and utility bills</strong>. Additionally, living by oneself can occasionally lead to <strong>feelings of isolation or vulnerability during illnesses</strong>."
      },
      {
        "q": "Do students now live alone more than their parents' generation did? Why/ Why not?",
        "vi": "Sinh viên ngày nay có sống một mình nhiều hơn thế hệ cha mẹ trước đây không?",
        "a": "Undoubtedly yes. With <strong>rapid urbanization and higher family incomes</strong>, parents can better support individual rentals. Modern young people also <strong>place greater value on individualism and autonomy</strong>."
      }
    ]
  },
  {
    "id": "b-topic-18",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 18",
    "title": "Living on campus is beneficial to college students.",
    "center": "Living on campus",
    "branches": [
      {
        "num": 1,
        "text": "convenience",
        "pos": "top",
        "type": "noun",
        "vi": "Sự tiện lợi trong đi lại và học tập"
      },
      {
        "num": 2,
        "text": "networking",
        "pos": "right",
        "type": "noun",
        "vi": "Kết nối, mở rộng bạn bè"
      },
      {
        "num": 3,
        "text": "reasonable cost",
        "pos": "bottom",
        "type": "noun",
        "vi": "Chi phí hợp lý, tiết kiệm"
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
        "q": "What are the disadvantages of living on campus?",
        "vi": "Những bất lợi của việc sống trong ký túc xá là gì?",
        "a": "A notable drawback is the <strong>scarcity of personal privacy in shared rooms</strong>. Moreover, residents must <strong>comply with strict university regulations and curfews</strong>, which can feel restrictive."
      },
      {
        "q": "What are the advantages and disadvantages of living off campus?",
        "vi": "Ưu và nhược điểm của việc thuê trọ ngoài khuôn viên trường là gì?",
        "a": "Off-campus housing offers <strong>greater lifestyle independence and personalized living quarters</strong>. Conversely, it entails <strong>higher monthly expenses and time-consuming daily commutes</strong>."
      },
      {
        "q": "Do you prefer living on campus or living off campus?",
        "vi": "Bạn thích sống trong ký túc xá hay ở trọ bên ngoài hơn?",
        "a": "I strongly prefer on-campus living because of its <strong>unmatched convenience, high security, and affordability</strong>. Being close to campus facilities enables me to <strong>maximize my university learning experience</strong>."
      }
    ]
  },
  {
    "id": "b-topic-19",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 19",
    "title": "There are many benefits of living in a dormitory.",
    "center": "Living in a dormitory",
    "branches": [
      {
        "num": 1,
        "text": "make new friends",
        "pos": "top",
        "type": "verb",
        "vi": "Làm quen thêm nhiều bạn mới"
      },
      {
        "num": 2,
        "text": "be close to the classroom",
        "pos": "right",
        "type": "verb",
        "vi": "Gần lớp học, tiết kiệm thời gian di chuyển"
      },
      {
        "num": 3,
        "text": "improve life skills",
        "pos": "bottom",
        "type": "verb",
        "vi": "Rèn luyện kỹ năng sống tự lập"
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
        "q": "What are the challenges of living in a dormitory?",
        "vi": "Những khó khăn thử thách khi sống trong ký túc xá là gì?",
        "a": "Residents commonly struggle with <strong>frequent noise distractions and divergent sleep schedules</strong>. Moreover, accommodating <strong>varying hygiene standards among roommates</strong> requires immense patience."
      },
      {
        "q": "Do you think all students should live in dormitories? Why or why not?",
        "vi": "Bạn có nghĩ tất cả sinh viên nên sống trong ký túc xá không?",
        "a": "Not necessarily for all, but <strong>experiencing dormitory life for at least one year is highly beneficial</strong>. It serves as an <strong>invaluable transition between parental guidance and full adulthood</strong>."
      },
      {
        "q": "How can students solve conflicts with roommates?",
        "vi": "Sinh viên có thể giải quyết xung đột với bạn cùng phòng bằng cách nào?",
        "a": "They should <strong>schedule calm room meetings to establish shared boundaries early on</strong>. Practicing <strong>mutual respect, active listening, and compromise</strong> is key to resolving tensions amicably."
      }
    ]
  },
  {
    "id": "b-topic-20",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 20",
    "title": "Taking a gap year is very beneficial.",
    "center": "Taking a gap year",
    "branches": [
      {
        "num": 1,
        "text": "gain experience",
        "pos": "top",
        "type": "verb",
        "vi": "Tích lũy kinh nghiệm sống và kỹ năng thực tế"
      },
      {
        "num": 2,
        "text": "recharge after years of schooling",
        "pos": "right",
        "type": "verb",
        "vi": "Nạp lại năng lượng sau những năm học tập căng thẳng"
      },
      {
        "num": 3,
        "text": "clarify goals for work or study",
        "pos": "bottom",
        "type": "verb",
        "vi": "Xác định rõ định hướng học tập và nghề nghiệp"
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
        "q": "What are some disadvantages of taking a gap year?",
        "vi": "Những bất lợi của việc dành một năm nghỉ ngơi (gap year) là gì?",
        "a": "A significant disadvantage is the **potential loss of academic momentum and peer dislocation**. Furthermore, without rigorous self-discipline, individuals risk **dissipating personal finances on unproductive pursuits**."
      },
      {
        "q": "Is taking a gap year popular in your country?",
        "vi": "Gap year có phổ biến ở đất nước của bạn không?",
        "a": "While gap years are gaining traction among urban Vietnamese youths, the phenomenon remains relatively niche because traditional families predominantly advocate **seamless progression from high school directly to tertiary institutions**."
      },
      {
        "q": "Will taking a gap year be more important to students in the future?",
        "vi": "Liệu việc đi gap year có trở nên quan trọng hơn với học sinh trong tương lai?",
        "a": "Inarguably. As automated labor evolves, recruiters will increasingly prize **emotional intelligence, adaptability, and cross-cultural experiential maturity**, competencies cultivated profoundly through purposeful gap-year endeavors."
      }
    ]
  },
  {
    "id": "b-topic-21",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 21",
    "title": "Waking up early is very beneficial.",
    "center": "Waking up early",
    "branches": [
      {
        "num": 1,
        "text": "increase productivity",
        "pos": "top",
        "type": "verb",
        "vi": "Nâng cao năng suất làm việc và học tập"
      },
      {
        "num": 2,
        "text": "feel fresher",
        "pos": "right",
        "type": "verb",
        "vi": "Cảm thấy tỉnh táo, sảng khoái và tràn đầy năng lượng"
      },
      {
        "num": 3,
        "text": "have many good habits",
        "pos": "bottom",
        "type": "verb",
        "vi": "Xây dựng được nhiều thói quen sinh hoạt tốt"
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
        "q": "Do people still pay attention to their health nowadays?",
        "vi": "Mọi người ngày nay có còn chú ý đến sức khỏe của mình không?",
        "a": "Undoubtedly. Heightened awareness regarding lifestyle diseases has spurred widespread commitment toward **nutritional monitoring, regular cardiovascular workouts, and preventive health screenings**."
      },
      {
        "q": "How can we encourage people to lead a healthy lifestyle?",
        "vi": "Làm thế nào để khuyến khích mọi người sống lành mạnh hơn?",
        "a": "Communities can foster wellness by **investing in accessible municipal sports parks, subsidizing organic agricultural products**, and promoting workplace wellness initiatives."
      },
      {
        "q": "Why do many people know that bad habits are harmful but still maintain them?",
        "vi": "Tại sao nhiều người biết thói quen xấu có hại nhưng vẫn duy trì?",
        "a": "Unwholesome behaviors such as late-night screen scrolling or junk food consumption provide **immediate dopamine gratification and temporary stress relief**, whereas breaking entrenched addictive loops requires **sustained psychological discipline**."
      }
    ]
  },
  {
    "id": "b-topic-22",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 22",
    "title": "Fast food is very beneficial.",
    "center": "Fast food",
    "branches": [
      {
        "num": 1,
        "text": "save money",
        "pos": "top",
        "type": "verb",
        "vi": "Tiết kiệm chi phí, giá cả hợp lý"
      },
      {
        "num": 2,
        "text": "save time",
        "pos": "right",
        "type": "verb",
        "vi": "Tiết kiệm thời gian chuẩn bị và nấu nướng"
      },
      {
        "num": 3,
        "text": "tasty",
        "pos": "bottom",
        "type": "adj",
        "vi": "Hương vị thơm ngon, hấp dẫn"
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
        "q": "Who typically consumes fast food the most?",
        "vi": "Ai là người tiêu thụ thức ăn nhanh nhiều nhất?",
        "a": "**Adolescents, college students, and corporate commuters** constitute the primary demographic due to their demanding schedules, budgetary constraints, and preference for convenient casual dining."
      },
      {
        "q": "Does fast food affect people's eating habits in recent times?",
        "vi": "Đồ ăn nhanh có ảnh hưởng đến thói quen ăn uống thời gian gần đây không?",
        "a": "Profoundly. The ubiquity of fast-food chains and on-demand delivery apps has normalized **sedentary eating patterns and diminished traditional home-cooking traditions** across urban communities."
      },
      {
        "q": "What are some disadvantages of fast food?",
        "vi": "Những bất lợi của thức ăn nhanh là gì?",
        "a": "Fast food is notoriously saturated with **trans fats, sodium, and refined carbohydrates**, drastically elevating the long-term incidence of **obesity, hypertension, and cardiovascular disorders**."
      }
    ]
  },
  {
    "id": "b-topic-23",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 23",
    "title": "Living in a hostel is beneficial for university students.",
    "center": "Living in a hostel",
    "branches": [
      {
        "num": 1,
        "text": "networking",
        "pos": "top",
        "type": "noun",
        "vi": "Mở rộng mạng lưới quan hệ và bạn bè"
      },
      {
        "num": 2,
        "text": "adaptability",
        "pos": "right",
        "type": "noun",
        "vi": "Rèn luyện khả năng thích nghi và hòa nhập"
      },
      {
        "num": 3,
        "text": "responsibility",
        "pos": "bottom",
        "type": "noun",
        "vi": "Nâng cao tinh thần trách nhiệm và tính tự lập"
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
        "q": "What are the disadvantages of living in a hostel?",
        "vi": "Những bất lợi của việc sống trong nhà trọ / ký túc xá là gì?",
        "a": "Primary drawbacks include **compromised personal privacy and noise disturbances**. Additionally, interpersonal friction may arise from disparate lifestyle schedules or hygiene standards among roommates."
      },
      {
        "q": "What should schools do to attract more students?",
        "vi": "Nhà trường nên làm gì để thu hút nhiều sinh viên hơn?",
        "a": "Educational institutions should **modernize residential infrastructure, ensure high-speed connectivity, and implement robust security protocols**, while maintaining subsidized accommodation fees."
      },
      {
        "q": "What should be considered when moving to a hostel?",
        "vi": "Cần cân nhắc điều gì khi chuyển vào sống ở nhà trọ / ký túc xá?",
        "a": "Essential factors include **geographic proximity to lecture halls, comprehensive rental costs, facility sanitation standards, and the stringency of security regulations**."
      }
    ]
  },
  {
    "id": "b-topic-24",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 24",
    "title": "Students should improve their self-study skills.",
    "center": "Self-study skills",
    "branches": [
      {
        "num": 1,
        "text": "more independence",
        "pos": "top",
        "type": "noun",
        "vi": "Rèn luyện tính tự lập trong tư duy và học tập"
      },
      {
        "num": 2,
        "text": "better time management",
        "pos": "right",
        "type": "noun",
        "vi": "Kỹ năng quản lý thời gian hiệu quả hơn"
      },
      {
        "num": 3,
        "text": "better academic performance",
        "pos": "bottom",
        "type": "noun",
        "vi": "Đạt kết quả và thành tích học tập vượt trội"
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
        "q": "Are self-study skills taught at schools in your country?",
        "vi": "Kỹ năng tự học có được giảng dạy tại các trường học ở nước bạn không?",
        "a": "Traditionally, rote memorization prevailed in Vietnamese curricula. However, modern educational reforms are increasingly incorporating **inquiry-based projects and independent research modules** to cultivate self-directed learning."
      },
      {
        "q": "Should self-study skills be a compulsory subject at school?",
        "vi": "Kỹ năng tự học có nên là một môn học bắt buộc ở trường không?",
        "a": "Formal instruction in **information retrieval, critical reading, and cognitive note-taking** should undoubtedly be compulsory, as these meta-learning skills underpin all academic and professional success."
      },
      {
        "q": "How does the lack of self-study skills affect students’ performance at university?",
        "vi": "Thiếu kỹ năng tự học ảnh hưởng như thế nào đến kết quả của sinh viên tại đại học?",
        "a": "Tertiary education demands immense independent reading. Undergraduates lacking autonomous research abilities frequently experience **academic disorientation, miss project deadlines, and underperform in research seminars**."
      }
    ]
  },
  {
    "id": "b-topic-25",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 25",
    "title": "A healthy breakfast brings people many benefits.",
    "center": "A healthy breakfast",
    "branches": [
      {
        "num": 1,
        "text": "control weight",
        "pos": "top",
        "type": "verb",
        "vi": "Hỗ trợ kiểm soát cân nặng hiệu quả"
      },
      {
        "num": 2,
        "text": "provide energy for the day",
        "pos": "right",
        "type": "verb",
        "vi": "Cung cấp nguồn năng lượng dồi dào cho cả ngày"
      },
      {
        "num": 3,
        "text": "prevent some health problems",
        "pos": "bottom",
        "type": "verb",
        "vi": "Phòng ngừa nhiều vấn đề sức khỏe và bệnh tật"
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
        "q": "What types of food are often served for breakfast?",
        "vi": "Những loại thực phẩm nào thường được dùng cho bữa sáng?",
        "a": "Traditional Vietnamese breakfasts feature **hot broths like phở, savory sticky rice, or crusty bánh mì**. In Western cultures, morning diets typically comprise **eggs, whole-grain toast, Greek yogurt, or oatmeal**."
      },
      {
        "q": "What are the negative effects of skipping breakfast?",
        "vi": "Những tác hại của việc bỏ bữa sáng là gì?",
        "a": "Skipping breakfast triggers **acute hypoglycemia, causing cognitive fog and lethargy**. Chronic skipping precipitates **gastric mucosal damage, metabolic deceleration, and compensatory evening overeating**."
      },
      {
        "q": "What makes a healthy diet?",
        "vi": "Điều gì tạo nên một chế độ ăn uống lành mạnh?",
        "a": "A wholesome diet necessitates a **balanced equilibrium of macronutrients, abundant fiber, micronutrients, and hydration**, alongside strict moderation of **refined sugars, sodium, and saturated fats**."
      }
    ]
  },
  {
    "id": "b-topic-26",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 26",
    "title": "A healthy diet brings people many benefits.",
    "center": "A healthy diet",
    "branches": [
      {
        "num": 1,
        "text": "keep fit",
        "pos": "top",
        "type": "verb",
        "vi": "Giữ gìn vóc dáng thon gọn và cân đối"
      },
      {
        "num": 2,
        "text": "refresh people’s mind",
        "pos": "right",
        "type": "verb",
        "vi": "Giúp tinh thần sảng khoái và giảm stress"
      },
      {
        "num": 3,
        "text": "prevent some diseases",
        "pos": "bottom",
        "type": "verb",
        "vi": "Phòng ngừa nhiều bệnh tật nguy hiểm"
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
        "q": "What makes your diet balanced?",
        "vi": "Điều gì làm cho chế độ ăn uống của bạn cân bằng?",
        "a": "A diet achieves nutritional balance when it incorporates **appropriate ratios of macronutrients, diverse micronutrients, dietary fiber, and adequate hydration**, while minimizing **refined sugars and saturated fats**."
      },
      {
        "q": "What should be done to raise awareness of having a healthy diet in your country?",
        "vi": "Cần làm gì để nâng cao nhận thức về ăn uống lành mạnh ở nước bạn?",
        "a": "Public authorities should **enforce transparent nutritional labeling, restrict junk-food advertisements targeting children**, and promote national campaigns educating citizens on balanced culinary practices."
      },
      {
        "q": "Which is more important for people’s health: a balanced diet or regular exercise?",
        "vi": "Điều gì quan trọng hơn cho sức khỏe: chế độ ăn cân bằng hay tập thể dục đều đặn?",
        "a": "Both are indispensable pillars of health. However, **nutrition is fundamentally foundational**, as an unhealthy diet loaded with toxins and excess calories cannot be out-trained by physical exercise alone."
      }
    ]
  },
  {
    "id": "b-topic-27",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 27",
    "title": "Trees are very important in people’s lives.",
    "center": "Trees",
    "branches": [
      {
        "num": 1,
        "text": "flood prevention",
        "pos": "top",
        "type": "noun",
        "vi": "Chống xói mòn và ngăn ngừa lũ lụt thiên tai"
      },
      {
        "num": 2,
        "text": "better environment",
        "pos": "right",
        "type": "noun",
        "vi": "Cải thiện môi trường sống và thanh lọc không khí"
      },
      {
        "num": 3,
        "text": "a source of food",
        "pos": "bottom",
        "type": "noun",
        "vi": "Cung cấp nguồn thực phẩm và dược liệu dồi dào"
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
        "q": "Do you think planting trees should be an extracurricular activity at school?",
        "vi": "Bạn có nghĩ rằng trồng cây nên là một hoạt động ngoại khóa ở trường không?",
        "a": "Undoubtedly. Organizing tree-planting excursions instills **ecological responsibility, environmental stewardship, and collaborative teamwork** among youths from an early age."
      },
      {
        "q": "What else can individuals do to protect the environment?",
        "vi": "Mỗi cá nhân có thể làm gì khác để bảo vệ môi trường?",
        "a": "Individuals can adopt sustainable habits such as **minimizing single-use plastics, patronizing public transit, conserving domestic energy**, and practicing disciplined waste recycling."
      },
      {
        "q": "What should the government do to increase green spaces?",
        "vi": "Chính phủ nên làm gì để tăng diện tích không gian xanh?",
        "a": "Authorities must enforce **stringent urban zoning mandates requiring green ratios in real estate developments**, penalize illegal logging, and expand public botanical sanctuaries."
      }
    ]
  },
  {
    "id": "b-topic-28",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 28",
    "title": "Reading fiction is more enjoyable than watching movies.",
    "center": "Reading fiction",
    "branches": [
      {
        "num": 1,
        "text": "improve imagination",
        "pos": "top",
        "type": "verb",
        "vi": "Kích thích và phát triển trí tưởng tượng phong phú"
      },
      {
        "num": 2,
        "text": "provide more information",
        "pos": "right",
        "type": "verb",
        "vi": "Cung cấp chi tiết và nội tâm nhân vật sâu sắc hơn"
      },
      {
        "num": 3,
        "text": "learn more languages",
        "pos": "bottom",
        "type": "verb",
        "vi": "Mở rộng vốn từ vựng và nâng cao trình độ ngôn ngữ"
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
        "q": "What are the disadvantages of reading fiction?",
        "vi": "Những bất lợi của việc đọc tiểu thuyết là gì?",
        "a": "Literary reading requires **substantial time investment and sustained concentration**. Furthermore, prolonged sedentary reading in inadequate lighting can precipitate **ocular fatigue and physical passivity**."
      },
      {
        "q": "What types of fiction are popular among teenagers in your country? Why?",
        "vi": "Thể loại tiểu thuyết nào phổ biến với thanh thiếu niên ở nước bạn? Tại sao?",
        "a": "**Fantasy sagas, detective thrillers, and young-adult romance** dominate youth preferences due to their **compelling cliffhangers, imaginative escapism, and resonant adolescent themes**."
      },
      {
        "q": "Should fiction writing be a compulsory subject in your country?",
        "vi": "Viết truyện hư cấu có nên là một môn học bắt buộc ở nước bạn không?",
        "a": "Making creative writing mandatory may burden analytically inclined students. Rather, educational institutions should **provide creative writing workshops as optional extracurricular modules**."
      }
    ]
  },
  {
    "id": "b-topic-29",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 29",
    "title": "There are some advantages of electric cars.",
    "center": "Electric cars",
    "branches": [
      {
        "num": 1,
        "text": "reduce pollution",
        "pos": "top",
        "type": "verb",
        "vi": "Cắt giảm khí thải và bảo vệ môi trường"
      },
      {
        "num": 2,
        "text": "save natural resources",
        "pos": "right",
        "type": "verb",
        "vi": "Tiết kiệm nguồn tài nguyên thiên nhiên và nhiên liệu hóa thạch"
      },
      {
        "num": 3,
        "text": "save money",
        "pos": "bottom",
        "type": "verb",
        "vi": "Tiết kiệm chi phí vận hành và bảo dưỡng"
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
        "q": "What are the disadvantages of electric cars?",
        "vi": "Những nhược điểm của xe ô tô điện là gì?",
        "a": "Major hurdles include **steep initial acquisition costs, limited battery driving range, and inadequate charging station infrastructure** outside major urban centers."
      },
      {
        "q": "Should companies give electric cars to employees?",
        "vi": "Các công ty có nên trang bị xe điện cho nhân viên không?",
        "a": "Providing company electric fleets reinforces **corporate sustainability commitments, reduces operational carbon footprints**, and enhances employee welfare."
      },
      {
        "q": "What should the government do to develop electric cars?",
        "vi": "Chính phủ nên làm gì để phát triển phương tiện xe điện?",
        "a": "Policymakers should implement **purchase tax exemptions, subsidize domestic battery manufacturing, and fund nationwide networks of public fast-charging terminals**."
      }
    ]
  },
  {
    "id": "b-topic-30",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 30",
    "title": "There are some advantages of working individually.",
    "center": "Working individually",
    "branches": [
      {
        "num": 1,
        "text": "have flexibility",
        "pos": "top",
        "type": "verb",
        "vi": "Có sự linh hoạt tối đa về thời gian và phương pháp"
      },
      {
        "num": 2,
        "text": "enjoy all of success",
        "pos": "right",
        "type": "verb",
        "vi": "Hưởng trọn vẹn thành quả và sự công nhận"
      },
      {
        "num": 3,
        "text": "encounter fewer conflicts",
        "pos": "bottom",
        "type": "verb",
        "vi": "Tránh được bất đồng và xung đột ý kiến"
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
        "q": "What are the disadvantages of working individually?",
        "vi": "Những nhược điểm của việc làm việc độc lập là gì?",
        "a": "Disadvantages include **vocational isolation, vulnerability to burnout, and the absence of diverse peer perspectives** to cross-examine complex dilemma."
      },
      {
        "q": "Who usually works individually?",
        "vi": "Ai là những người thường làm việc một mình?",
        "a": "**Creative freelancers, novelists, independent researchers, and software developers** typically work autonomously, as their occupations demand uninterrupted cognitive absorption."
      },
      {
        "q": "Why do people like to work individually?",
        "vi": "Tại sao nhiều người thích làm việc một mình?",
        "a": "People favor solo work to preserve **methodological autonomy, escape bureaucratic compromises, and avoid the friction of uncommitted collaborators**."
      }
    ]
  },
  {
    "id": "b-topic-31",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 31",
    "title": "University education is beneficial to students in a number of ways.",
    "center": "University education",
    "branches": [
      {
        "num": 1,
        "text": "academic education",
        "pos": "top",
        "type": "noun",
        "vi": "Tiếp thu nền tảng kiến thức học thuật chuyên sâu"
      },
      {
        "num": 2,
        "text": "job opportunities",
        "pos": "right",
        "type": "noun",
        "vi": "Mở rộng cơ hội việc làm và mức thu nhập cao"
      },
      {
        "num": 3,
        "text": "social skills",
        "pos": "bottom",
        "type": "noun",
        "vi": "Rèn luyện các kỹ năng mềm và kỹ năng xã hội"
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
        "q": "What do you think about university entrance exams in Vietnam?",
        "vi": "Bạn nghĩ gì về kỳ thi tuyển sinh đại học ở Việt Nam?",
        "a": "The national examination is **intensely competitive and psychologically demanding**. Nevertheless, standardized testing maintains **transparent meritocracy and equitable access** to premier universities."
      },
      {
        "q": "What do you think education in Vietnam will be like in the future?",
        "vi": "Bạn nghĩ giáo dục ở Việt Nam trong tương lai sẽ như thế nào?",
        "a": "Vietnamese education will increasingly incorporate **AI-driven personalized curricula, hybrid digital classrooms, and industry-partnered experiential modules**."
      },
      {
        "q": "University is the only way to success. Do you agree?",
        "vi": "Đại học là con đường duy nhất dẫn đến thành công. Bạn có đồng ý không?",
        "a": "I firmly disagree. Higher education provides valuable advantages, yet extraordinary success can equally be attained through **vocational excellence, self-taught expertise, and entrepreneurial boldness**."
      }
    ]
  },
  {
    "id": "b-topic-32",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 32",
    "title": "Young people should be encouraged to play musical instruments.",
    "center": "Playing musical instruments",
    "branches": [
      {
        "num": 1,
        "text": "reduce stress",
        "pos": "top",
        "type": "verb",
        "vi": "Giảm căng thẳng và cân bằng cảm xúc"
      },
      {
        "num": 2,
        "text": "manage time better",
        "pos": "right",
        "type": "verb",
        "vi": "Rèn luyện tính kỷ luật và quản lý thời gian tốt hơn"
      },
      {
        "num": 3,
        "text": "improve connections",
        "pos": "bottom",
        "type": "verb",
        "vi": "Tăng cường kết nối xã hội và tự tin giao tiếp"
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
        "q": "Do you think music should be a necessary subject in school? Why or why not?",
        "vi": "Bạn có nghĩ rằng âm nhạc nên là môn học bắt buộc ở trường không? Tại sao?",
        "a": "Undoubtedly. Music education stimulates **bilateral brain connectivity, refines aesthetic appreciation**, and provides vital emotional balance amid rigorous academic demands."
      },
      {
        "q": "What are some popular musical instruments in your country?",
        "vi": "Những nhạc cụ nào phổ biến ở đất nước của bạn?",
        "a": "Contemporary youths predominantly favor **acoustic guitars, digital pianos, and drums**, while traditional folk instruments like **the monochord (đàn bầu) and zither (đàn tranh)** are preserved reverently."
      },
      {
        "q": "What are some kinds of popular traditional music in your country?",
        "vi": "Những thể loại âm nhạc truyền thống nào phổ biến ở nước bạn?",
        "a": "Vietnam boasts prestigious musical legacies recognized by UNESCO, notably **Quan họ folk duets, Hue royal court music (Nhã nhạc), and Đờn ca tài tử** from the Mekong Delta."
      }
    ]
  },
  {
    "id": "b-topic-33",
    "category": "benefits",
    "categoryName": "Nhóm Lợi Ích",
    "topicCode": "ĐỀ SỐ 33",
    "title": "Doing exercise is good for people’s health.",
    "center": "Doing exercise",
    "branches": [
      {
        "num": 1,
        "text": "keep fit",
        "pos": "top",
        "type": "verb",
        "vi": "Giữ gìn vóc dáng cân đối và săn chắc"
      },
      {
        "num": 2,
        "text": "prevent diseases",
        "pos": "right",
        "type": "verb",
        "vi": "Phòng chống các bệnh tim mạch và mãn tính"
      },
      {
        "num": 3,
        "text": "improve people’s mood",
        "pos": "bottom",
        "type": "verb",
        "vi": "Cải thiện tâm trạng và giải tỏa căng thẳng"
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
        "q": "Where do people in your area usually exercise?",
        "vi": "Mọi người ở khu vực bạn sống thường tập thể dục ở đâu?",
        "a": "Residents predominantly frequent **municipal parks, pedestrian lakesides, and modern fitness clubs** to engage in walking, aerobics, or weight training."
      },
      {
        "q": "What is the most popular sport where you live?",
        "vi": "Môn thể thao phổ biến nhất ở nơi bạn sống là gì?",
        "a": "**Association football and badminton** enjoy immense popularity. Football attracts vast grassroots participation, while badminton remains ubiquitous across public courtyards."
      },
      {
        "q": "Should physical exercise be included in schools?",
        "vi": "Thể dục thể thao có nên được đưa vào trường học không?",
        "a": "Inarguably. Comprehensive physical education is indispensable to **combat sedentary habits, promote skeletal growth, and instill lifelong athletic discipline** among schoolchildren."
      }
    ]
  },
  {
    "id": "d-topic-07",
    "category": "drawbacks",
    "categoryName": "Nhóm Bất Lợi",
    "topicCode": "ĐỀ SỐ 07",
    "title": "There are a lot of disadvantages to keeping animals in zoos.",
    "center": "Keeping animals in zoos",
    "branches": [
      {
        "num": 1,
        "text": "lack of space",
        "pos": "top",
        "type": "noun",
        "vi": "Thiếu không gian sống tự nhiên"
      },
      {
        "num": 2,
        "text": "lack of survival skills",
        "pos": "right",
        "type": "noun",
        "vi": "Mất dần kỹ năng sinh tồn tự nhiên"
      },
      {
        "num": 3,
        "text": "loss of freedom",
        "pos": "bottom",
        "type": "noun",
        "vi": "Mất tự do, bị giam giữ"
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
        "q": "What kinds of animals are usually kept in zoos?",
        "vi": "Những loài động vật nào thường được nuôi nhốt trong sở thú?",
        "a": "Zoos predominantly exhibit <strong>exotic wildlife, endangered mammals like primates and big cats</strong>, alongside <strong>rare reptiles and aquatic species that captivate public curiosity</strong>."
      },
      {
        "q": "What are the benefits of keeping animals in zoos?",
        "vi": "Những lợi ích của việc giữ động vật trong sở thú là gì?",
        "a": "Modern accredited zoos contribute to <strong>scientific research and captive breeding of critically endangered species</strong>. They also <strong>inspire conservation awareness and ecological empathy among young visitors</strong>."
      },
      {
        "q": "What can people do to protect wildlife species?",
        "vi": "Con người có thể làm gì để bảo vệ các loài động vật hoang dã?",
        "a": "Citizens must <strong>boycott illicit wildlife souvenirs and support sustainable national parks</strong>. Governments must <strong>impose severe penalties against poaching and preserve contiguous forest reserves</strong>."
      }
    ]
  },
  {
    "id": "d-topic-08",
    "category": "drawbacks",
    "categoryName": "Nhóm Bất Lợi",
    "topicCode": "ĐỀ SỐ 08",
    "title": "There are several negative effects of online communication.",
    "center": "Online communication",
    "branches": [
      {
        "num": 1,
        "text": "reduce face-to-face interaction",
        "pos": "top",
        "type": "verb",
        "vi": "Làm giảm tương tác trực tiếp"
      },
      {
        "num": 2,
        "text": "lead to conflict",
        "pos": "right",
        "type": "verb",
        "vi": "Dễ dẫn đến hiểu lầm, xung đột"
      },
      {
        "num": 3,
        "text": "get distracted easily",
        "pos": "bottom",
        "type": "verb",
        "vi": "Dễ bị xao nhãng khỏi công việc/học tập"
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
        "q": "What kind of modern communication technology do you use most often?",
        "vi": "Bạn thường sử dụng công nghệ giao tiếp hiện đại nào nhất?",
        "a": "I predominantly rely on <strong>encrypted messaging platforms and video conferencing suites like Zoom and Teams</strong>. They streamline <strong>instant collaborative file-sharing and high-definition group discussions</strong> seamlessly."
      },
      {
        "q": "Do you think technology will completely replace face-to-face communication in the future?",
        "vi": "Liệu công nghệ có thay thế hoàn toàn giao tiếp trực tiếp trong tương lai không?",
        "a": "Certainly not. Human psychology fundamentally requires <strong>physical presence, subtle micro-expressions, and physical warmth to establish deep trust</strong>, which virtual avatars can never replicate."
      },
      {
        "q": "How can people avoid problems caused by online communication?",
        "vi": "Mọi người có thể tránh những rắc rối do giao tiếp trực tuyến gây ra bằng cách nào?",
        "a": "Users should <strong>exercise mindful phrasing and avoid sending sensitive remarks in anger</strong>. When tensions arise, switching immediately to <strong>a voice call or an in-person meeting clarifies intent and repairs goodwill</strong>."
      }
    ]
  },
  {
    "id": "d-topic-09",
    "category": "drawbacks",
    "categoryName": "Nhóm Bất Lợi",
    "topicCode": "ĐỀ SỐ 09",
    "title": "There are several drawbacks of internships.",
    "center": "Internships",
    "branches": [
      {
        "num": 1,
        "text": "unpaid or low-paid work",
        "pos": "top",
        "type": "noun",
        "vi": "Công việc không lương hoặc lương rất thấp"
      },
      {
        "num": 2,
        "text": "heavy workload and pressure",
        "pos": "right",
        "type": "noun",
        "vi": "Khối lượng công việc lớn và nhiều áp lực"
      },
      {
        "num": 3,
        "text": "limited guidance",
        "pos": "bottom",
        "type": "noun",
        "vi": "Ít nhận được sự hướng dẫn chu đáo"
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
        "q": "Do you think students should be required to complete an internship before graduation? Why?",
        "vi": "Có nên bắt buộc sinh viên hoàn thành kỳ thực tập trước khi tốt nghiệp không?",
        "a": "Yes, mandatory internships are <strong>vital for bridging abstract textbook theory with pragmatic workplace dynamics</strong>. They cultivate <strong>professional etiquette, deadline discipline, and crucial industry acumen</strong>."
      },
      {
        "q": "How do internships influence students’ future job opportunities?",
        "vi": "Kỳ thực tập ảnh hưởng như thế nào đến cơ hội việc làm sau này của sinh viên?",
        "a": "They dramatically <strong>bolster resume credibility and expand professional networks</strong>. Outstanding interns frequently secure <strong>pre-graduation return offers, bypassing competitive recruitment rounds</strong>."
      },
      {
        "q": "What can universities do to help students have better internship experiences?",
        "vi": "Các trường đại học có thể làm gì để giúp sinh viên có trải nghiệm thực tập tốt hơn?",
        "a": "Institutions should <strong>establish formal corporate partnerships with vetted ethical firms</strong>. Furthermore, faculty advisors should <strong>monitor intern welfare and ensure structured learning benchmarks</strong>."
      }
    ]
  },
  {
    "id": "c-topic-07",
    "category": "causes",
    "categoryName": "Nhóm Nguyên Nhân / Lý Do",
    "topicCode": "ĐỀ SỐ 07",
    "title": "There are several reasons why responsibility is important.",
    "center": "Responsibility",
    "branches": [
      {
        "num": 1,
        "text": "improve teamwork skills",
        "pos": "top",
        "type": "verb",
        "vi": "Nâng cao kỹ năng làm việc nhóm"
      },
      {
        "num": 2,
        "text": "earn trust from others",
        "pos": "right",
        "type": "verb",
        "vi": "Giành được sự tin cậy từ người khác"
      },
      {
        "num": 3,
        "text": "achieve better results",
        "pos": "bottom",
        "type": "verb",
        "vi": "Đạt được kết quả và thành tích tốt hơn"
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
        "q": "What are some responsibilities that young people should have?",
        "vi": "Những trách nhiệm mà người trẻ nên có là gì?",
        "a": "Youths should cultivate <strong>diligent academic self-discipline and civic compliance</strong>. Beyond self-advancement, actively contributing to <strong>environmental stewardship and family welfare is paramount</strong>."
      },
      {
        "q": "Do you think people today are more or less responsible than in the past? Why?",
        "vi": "Bạn nghĩ người ngày nay có trách nhiệm hơn hay ít hơn trước đây?",
        "a": "Accountability has evolved rather than diminished. While older generations focused on <strong>domestic and workplace loyalty</strong>, modern individuals demonstrate heightened responsibility toward <strong>global climate action, ethical consumerism, and digital integrity</strong>."
      },
      {
        "q": "How can parents or schools teach children to become more responsible?",
        "vi": "Cha mẹ hoặc nhà trường có thể dạy trẻ trở nên có trách nhiệm hơn bằng cách nào?",
        "a": "Educators and parents should <strong>delegate age-appropriate autonomy and permit children to face natural consequences</strong>. Rewarding <strong>reliable follow-through rather than innate talent fosters deep-seated accountability</strong>."
      }
    ]
  },
  {
    "id": "c-topic-08",
    "category": "causes",
    "categoryName": "Nhóm Nguyên Nhân / Lý Do",
    "topicCode": "ĐỀ SỐ 08",
    "title": "There are several reasons why training workshops are important in life.",
    "center": "Training workshops",
    "branches": [
      {
        "num": 1,
        "text": "update knowledge",
        "pos": "top",
        "type": "verb",
        "vi": "Cập nhật những kiến thức mới"
      },
      {
        "num": 2,
        "text": "develop new professional skills",
        "pos": "right",
        "type": "verb",
        "vi": "Phát triển thêm các kỹ năng chuyên môn"
      },
      {
        "num": 3,
        "text": "expand social networks",
        "pos": "bottom",
        "type": "verb",
        "vi": "Mở rộng các mối quan hệ xã hội và nghề nghiệp"
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
        "q": "What kinds of workshops are popular in your area?",
        "vi": "Những loại hội thảo nào đang phổ biến ở khu vực của bạn?",
        "a": "<strong>Data analytics bootcamps, AI integration seminars, and leadership coaching workshops</strong> enjoy immense popularity, reflecting our economy's rapid digital transition."
      },
      {
        "q": "Why do some people prefer online workshops to face-to-face ones?",
        "vi": "Tại sao một số người thích các hội thảo trực tuyến hơn gặp mặt trực tiếp?",
        "a": "Virtual workshops eliminate <strong>geographical boundaries and commuting expenses</strong>. They offer <strong>unrivaled schedule flexibility and access to on-demand archival recordings</strong>."
      },
      {
        "q": "How can companies encourage their employees to join training workshops?",
        "vi": "Các công ty có thể khuyến khích nhân viên tham gia các buổi đào tạo bằng cách nào?",
        "a": "Enterprises should <strong>fully sponsor tuition fees and allocate dedicated learning hours within the workweek</strong>. Linking <strong>credential attainment directly to promotion benchmarks provides powerful motivation</strong>."
      }
    ]
  },
  {
    "id": "c-topic-09",
    "category": "causes",
    "categoryName": "Nhóm Nguyên Nhân / Lý Do",
    "topicCode": "ĐỀ SỐ 09",
    "title": "There are several reasons why decision-making skills are important.",
    "center": "Decision-making skills",
    "branches": [
      {
        "num": 1,
        "text": "solve problems effectively",
        "pos": "top",
        "type": "verb",
        "vi": "Giải quyết các vấn đề một cách hiệu quả"
      },
      {
        "num": 2,
        "text": "improve personal responsibility",
        "pos": "right",
        "type": "verb",
        "vi": "Nâng cao tinh thần trách nhiệm của bản thân"
      },
      {
        "num": 3,
        "text": "save time",
        "pos": "bottom",
        "type": "verb",
        "vi": "Tiết kiệm thời gian và hạn chế sai lầm"
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
        "q": "Who do you think should learn decision-making skills?",
        "vi": "Theo bạn những ai nên học kỹ năng ra quyết định?",
        "a": "Indisputably everyone, but <strong>youths entering the workforce and corporate managers need it most urgently</strong> to navigate career transitions and complex team dilemmas."
      },
      {
        "q": "What can happen if a person doesn’t have good decision-making skills?",
        "vi": "Điều gì có thể xảy ra nếu một người không có kỹ năng ra quyết định tốt?",
        "a": "They often succumb to <strong>chronic hesitation, poor judgment under pressure, and regretful life outcomes</strong>, which compromises both mental peace and career trajectory."
      },
      {
        "q": "How can people learn or develop decision-making skills?",
        "vi": "Mọi người có thể rèn luyện hoặc phát triển kỹ năng ra quyết định bằng cách nào?",
        "a": "People can <strong>analyze past mistakes constructively, consult experienced advisors, and apply structured risk-reward matrix frameworks</strong> before committing to major paths."
      }
    ]
  },
  {
    "id": "c-topic-10",
    "category": "causes",
    "categoryName": "Nhóm Nguyên Nhân / Lý Do",
    "topicCode": "ĐỀ SỐ 10",
    "title": "Maintaining calmness is important for effective communication.",
    "center": "Maintaining calmness",
    "branches": [
      {
        "num": 1,
        "text": "promote active listening",
        "pos": "top",
        "type": "verb",
        "vi": "Thúc đẩy việc chú tâm lắng nghe người khác"
      },
      {
        "num": 2,
        "text": "solve conflicts",
        "pos": "right",
        "type": "verb",
        "vi": "Giúp tháo gỡ và giải quyết các mâu thuẫn"
      },
      {
        "num": 3,
        "text": "help build understanding",
        "pos": "bottom",
        "type": "verb",
        "vi": "Xây dựng sự thấu hiểu lẫn nhau"
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
        "q": "What other factors are important for effective communication?",
        "vi": "Những yếu tố nào khác cũng quan trọng để giao tiếp hiệu quả?",
        "a": "Beyond composure, <strong>articulate clarity, empathetic body language, and non-judgmental openness</strong> are equally paramount for authentic resonance."
      },
      {
        "q": "Why do you think some people find it difficult to stay calm in conversations?",
        "vi": "Tại sao một số người lại thấy khó giữ bình tĩnh trong các cuộc trò chuyện?",
        "a": "Many individuals feel <strong>personally threatened by dissenting viewpoints or suffer from chronic emotional burnout</strong>, prompting subconscious fight-or-flight defensive responses."
      },
      {
        "q": "Do you think people should always stay calm when communicating? Why or why not?",
        "vi": "Bạn có nghĩ mọi người lúc nào cũng nên giữ bình tĩnh khi giao tiếp không? Tại sao?",
        "a": "In professional and problem-solving contexts, <strong>yes, composure is essential</strong>. However, expressing <strong>controlled passion and righteous indignation can occasionally emphasize genuine urgency</strong>."
      }
    ]
  },
  {
    "id": "w-topic-10",
    "category": "ways",
    "categoryName": "Nhóm Cách Thức",
    "topicCode": "ĐỀ SỐ 10",
    "title": "There are several solutions to reduce obesity.",
    "center": "Reduce obesity",
    "branches": [
      {
        "num": 1,
        "text": "cook at home",
        "pos": "top",
        "type": "verb",
        "vi": "Tự nấu ăn lành mạnh tại nhà"
      },
      {
        "num": 2,
        "text": "limit fast food consumption",
        "pos": "right",
        "type": "verb",
        "vi": "Hạn chế ăn thức ăn nhanh"
      },
      {
        "num": 3,
        "text": "do more physical exercise",
        "pos": "bottom",
        "type": "verb",
        "vi": "Tập thể dục thể thao nhiều hơn"
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
        "q": "What types of fast food are popular in your country?",
        "vi": "Những loại đồ ăn nhanh nào phổ biến ở nước bạn?",
        "a": "<strong>Deep-fried chicken franchises, loaded burgers, bubble milk tea, and street food skewers</strong> dominate urban teenage culture, driven by aggressive digital marketing."
      },
      {
        "q": "Why do many people choose to eat fast food?",
        "vi": "Tại sao nhiều người lại chọn ăn đồ ăn nhanh?",
        "a": "Modern lifestyles demand <strong>hyper-convenient, immediate meals for busy professionals</strong>. Furthermore, fast food is engineered with <strong>addictive sugar-salt combinations that trigger temporary pleasure</strong>."
      },
      {
        "q": "What can governments do to encourage people to live a healthier lifestyle?",
        "vi": "Chính phủ có thể làm gì để khuyến khích người dân sống lành mạnh hơn?",
        "a": "Authorities should <strong>levy taxes on sugary beverages and subsidize raw agricultural produce</strong>. Additionally, investing in <strong>walkable pedestrian infrastructure and free public athletic centers</strong> encourages active living."
      }
    ]
  },
  {
    "id": "w-topic-11",
    "category": "ways",
    "categoryName": "Nhóm Cách Thức",
    "topicCode": "ĐỀ SỐ 11",
    "title": "There are several ways to make the world a better place.",
    "center": "Make the world a better place",
    "branches": [
      {
        "num": 1,
        "text": "reduce pollution",
        "pos": "top",
        "type": "verb",
        "vi": "Giảm thiểu ô nhiễm môi trường"
      },
      {
        "num": 2,
        "text": "do volunteer work",
        "pos": "right",
        "type": "verb",
        "vi": "Tham gia công việc tình nguyện"
      },
      {
        "num": 3,
        "text": "follow laws and regulations",
        "pos": "bottom",
        "type": "verb",
        "vi": "Tuân thủ luật pháp và các quy định"
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
        "q": "What environmental problems are most serious in your country?",
        "vi": "Vấn đề môi trường nào nghiêm trọng nhất ở nước bạn?",
        "a": "<strong>Severe particulate air pollution in metropolitan centers and industrial river contamination</strong> represent the most alarming ecological crises, demanding urgent regulatory overhaul."
      },
      {
        "q": "Do you think individuals or the government should take more responsibility for improving society?",
        "vi": "Cá nhân hay chính phủ nên chịu nhiều trách nhiệm hơn trong việc cải thiện xã hội?",
        "a": "It mandates <strong>a synchronized symbiotic partnership</strong>. Governments provide <strong>macro policy frameworks and infrastructure</strong>, whereas individuals must <strong>demonstrate daily civic integrity and grassroots cooperation</strong>."
      },
      {
        "q": "How can young people help create a better future for the world?",
        "vi": "Người trẻ có thể giúp tạo ra một tương lai tốt đẹp hơn cho thế giới bằng cách nào?",
        "a": "Young visionaries should <strong>master emerging green technologies, champion social equity, and vote conscientiously</strong>. Their <strong>boundless innovation and ethical passion are humanity's greatest assets</strong>."
      }
    ]
  },
  {
    "id": "w-topic-12",
    "category": "ways",
    "categoryName": "Nhóm Cách Thức",
    "topicCode": "ĐỀ SỐ 12",
    "title": "Technology has influenced people’s working habits in many ways.",
    "center": "Technology and working habits",
    "branches": [
      {
        "num": 1,
        "text": "offer flexible working styles",
        "pos": "top",
        "type": "verb",
        "vi": "Mang lại các hình thức làm việc linh hoạt như làm việc từ xa"
      },
      {
        "num": 2,
        "text": "support communication",
        "pos": "right",
        "type": "verb",
        "vi": "Hỗ trợ việc giao tiếp, họp trực tuyến dễ dàng"
      },
      {
        "num": 3,
        "text": "increase efficiency",
        "pos": "bottom",
        "type": "verb",
        "vi": "Nâng cao năng suất và hiệu quả công việc"
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
        "q": "How has technology made work easier for people nowadays?",
        "vi": "Công nghệ đã giúp công việc của con người dễ dàng hơn như thế nào ngày nay?",
        "a": "It <strong>automates tedious calculations, facilitates instant information retrieval, and allows ubiquitous paperless collaboration</strong> from any corner of the globe."
      },
      {
        "q": "What skills do workers need to use technology effectively?",
        "vi": "Người lao động cần những kỹ năng gì để sử dụng công nghệ hiệu quả?",
        "a": "Modern employees require <strong>agile digital literacy, data cybersecurity intuition, and continuous technical self-learning</strong> to harness emerging AI and software tools."
      },
      {
        "q": "Do you think technology will improve working habits even more in the future?",
        "vi": "Bạn có nghĩ công nghệ sẽ còn cải thiện thói quen làm việc nhiều hơn nữa trong tương lai?",
        "a": "Inevitably yes. <strong>Generative AI copilots and immersive virtual reality workspaces</strong> will eliminate mundane administrative overhead, though <strong>maintaining digital wellness will become an imperative challenge</strong>."
      }
    ]
  },
  {
    "id": "d-topic-10",
    "category": "drawbacks",
    "categoryName": "Nhóm Bất Lợi",
    "topicCode": "ĐỀ SỐ 10",
    "title": "There are some drawbacks of using private cars in big cities.",
    "center": "Private cars",
    "branches": [
      {
        "num": 1,
        "text": "cause traffic jams",
        "pos": "top",
        "type": "verb",
        "vi": "Gây ùn tắc giao thông nghiêm trọng"
      },
      {
        "num": 2,
        "text": "pollute the environment",
        "pos": "right",
        "type": "verb",
        "vi": "Gây ô nhiễm môi trường và không khí"
      },
      {
        "num": 3,
        "text": "waste money",
        "pos": "bottom",
        "type": "verb",
        "vi": "Tốn kém chi phí, lãng phí tiền bạc"
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
        "q": "Why do people often use private cars?",
        "vi": "Tại sao mọi người thường thích sử dụng xe ô tô cá nhân?",
        "a": "People favor private cars primarily because of **superior personal comfort, privacy, and scheduling flexibility**. Drivers can travel on demand without enduring weather exposure or relying on rigid public transit timetables."
      },
      {
        "q": "What means of public transportation should be developed in the area that you live in?",
        "vi": "Phương tiện giao thông công cộng nào nên được phát triển ở khu vực bạn sống?",
        "a": "Local authorities should prioritize **expanding high-capacity metro networks and eco-friendly electric bus fleets**. These mass-transit systems can **alleviate road congestion** and promote sustainable urban mobility."
      },
      {
        "q": "Do you think public transportation should be free?",
        "vi": "Bạn có nghĩ rằng phương tiện công cộng nên được miễn phí không?",
        "a": "Providing fare-free public transportation could dramatically **incentivize commuters to abandon private automobiles**, thereby curbing citywide emissions. However, governments must secure substantial tax funding to ensure **consistent maintenance and service reliability**."
      }
    ]
  },
  {
    "id": "d-topic-11",
    "category": "drawbacks",
    "categoryName": "Nhóm Bất Lợi",
    "topicCode": "ĐỀ SỐ 11",
    "title": "There are many drawbacks of cohabitation.",
    "center": "Cohabitation",
    "branches": [
      {
        "num": 1,
        "text": "higher rate of separation",
        "pos": "top",
        "type": "noun",
        "vi": "Tỷ lệ chia tay và tan vỡ cao hơn"
      },
      {
        "num": 2,
        "text": "more financial issues",
        "pos": "right",
        "type": "noun",
        "vi": "Nhiều khúc mắc và bất đồng về tài chính"
      },
      {
        "num": 3,
        "text": "more tension",
        "pos": "bottom",
        "type": "noun",
        "vi": "Nhiều áp lực và căng thẳng tâm lý"
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
        "q": "What do you think about young people getting married nowadays?",
        "vi": "Bạn nghĩ gì về việc giới trẻ kết hôn ngày nay?",
        "a": "Nowadays, young adults increasingly **postpone marriage until their late twenties or thirties**. They prioritize **educational attainment, career stability, and financial autonomy** before committing to family obligations."
      },
      {
        "q": "Do you think Western values influence young people's views on marriage in Vietnam?",
        "vi": "Bạn có nghĩ các giá trị phương Tây ảnh hưởng đến quan điểm hôn nhân của giới trẻ Việt Nam?",
        "a": "Undoubtedly, modern Western values have promoted **individualism and lifestyle autonomy** among Vietnamese youths, making non-traditional arrangements such as cohabitation and late marriage increasingly prevalent in urban areas."
      },
      {
        "q": "Why is the divorce rate increasing?",
        "vi": "Tại sao tỷ lệ ly hôn ngày càng gia tăng?",
        "a": "Rising divorce rates stem from a combination of **economic stress, changing gender expectations, and diminished communication**. Furthermore, contemporary individuals are **less willing to tolerate toxic partnerships** when irreconcilable differences emerge."
      }
    ]
  },
  {
    "id": "d-topic-12",
    "category": "drawbacks",
    "categoryName": "Nhóm Bất Lợi",
    "topicCode": "ĐỀ SỐ 12",
    "title": "Social media has some disadvantages.",
    "center": "Social media",
    "branches": [
      {
        "num": 1,
        "text": "get distracted easily",
        "pos": "top",
        "type": "verb",
        "vi": "Dễ bị xao nhãng học tập và công việc"
      },
      {
        "num": 2,
        "text": "lack face-to-face interaction",
        "pos": "right",
        "type": "verb",
        "vi": "Thiếu sự tương tác và gắn kết trực tiếp"
      },
      {
        "num": 3,
        "text": "leak personal information",
        "pos": "bottom",
        "type": "verb",
        "vi": "Dễ bị rò rỉ và lộ thông tin cá nhân"
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
        "q": "Do you think social media is important for young people today?",
        "vi": "Bạn có nghĩ rằng mạng xã hội quan trọng với giới trẻ ngày nay không?",
        "a": "Yes, undoubtedly. Social media serves as an indispensable tool for contemporary youths to **expand professional networks, access collaborative educational resources, and express creative perspectives**."
      },
      {
        "q": "Which social media platforms are the most popular nowadays?",
        "vi": "Nền tảng mạng xã hội nào phổ biến nhất hiện nay?",
        "a": "Currently, **TikTok, Facebook, and Instagram** dominate the digital landscape. TikTok is immensely favored for its **engaging short-form video algorithms**, while Instagram remains premier for visual storytelling and branding."
      },
      {
        "q": "Should children be supervised when they use social media? Why or why not?",
        "vi": "Trẻ em có nên được giám sát khi dùng mạng xã hội không? Tại sao?",
        "a": "Strict parental supervision is imperative to **safeguard underage children against predatory schemes, toxic misinformation, and cyberbullying**, while fostering disciplined digital habits."
      }
    ]
  },
  {
    "id": "w-topic-13",
    "category": "ways",
    "categoryName": "Nhóm Cách Thức",
    "topicCode": "ĐỀ SỐ 13",
    "title": "There are some funny ways to learn English.",
    "center": "Learn English",
    "branches": [
      {
        "num": 1,
        "text": "games",
        "pos": "top",
        "type": "noun",
        "vi": "Chơi các trò chơi ngôn ngữ"
      },
      {
        "num": 2,
        "text": "english clubs",
        "pos": "right",
        "type": "noun",
        "vi": "Tham gia các câu lạc bộ tiếng Anh"
      },
      {
        "num": 3,
        "text": "songs",
        "pos": "bottom",
        "type": "noun",
        "vi": "Học tiếng Anh qua các bài hát"
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
        "q": "Why is playing games useful for learning English?",
        "vi": "Tại sao chơi trò chơi lại hữu ích cho việc học tiếng Anh?",
        "a": "Gamification eliminates academic anxiety and **stimulates cognitive engagement**. Through interactive challenges, learners reinforce lexical memory and apply language in **spontaneous contexts**."
      },
      {
        "q": "Does learning English through music help improve English skills?",
        "vi": "Học tiếng Anh qua âm nhạc có giúp cải thiện kỹ năng không?",
        "a": "Certainly. Musical lyrics expose students to **authentic rhythm, connected speech, and colloquial idioms**, significantly refining auditory discrimination and oral cadence."
      },
      {
        "q": "Do children find it easier to learn English than adults?",
        "vi": "Trẻ em có học tiếng Anh dễ hơn người lớn không?",
        "a": "Neuroscientifically, children possess greater **linguistic neuroplasticity**, allowing them to acquire near-native pronunciation intuitively through immersion, whereas adults rely heavily on analytical deduction."
      }
    ]
  },
  {
    "id": "w-topic-14",
    "category": "ways",
    "categoryName": "Nhóm Cách Thức",
    "topicCode": "ĐỀ SỐ 14",
    "title": "There are many ways to create healthy eating habits.",
    "center": "Healthy eating habits",
    "branches": [
      {
        "num": 1,
        "text": "eat more vegetables",
        "pos": "top",
        "type": "verb",
        "vi": "Ăn nhiều rau xanh và trái cây tươi"
      },
      {
        "num": 2,
        "text": "cook at home more regularly",
        "pos": "right",
        "type": "verb",
        "vi": "Tự nấu ăn tại nhà thường xuyên hơn"
      },
      {
        "num": 3,
        "text": "eat less fast food",
        "pos": "bottom",
        "type": "verb",
        "vi": "Hạn chế đồ ăn nhanh và thực phẩm chế biến sẵn"
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
        "q": "Why is it important to build healthy eating habits?",
        "vi": "Tại sao việc xây dựng thói quen ăn uống lành mạnh lại quan trọng?",
        "a": "Cultivating balanced nutritional habits **optimizes metabolic function, sustains energy levels, and bolsters immune defenses**, ultimately mitigating the long-term risk of degenerative chronic ailments."
      },
      {
        "q": "In your opinion, how has eating behavior in your area changed compared to the past?",
        "vi": "Theo bạn, thói quen ăn uống ở nơi bạn sống đã thay đổi như thế nào so với trước đây?",
        "a": "Historically, traditional diets emphasized **fresh home-prepared staples and seasonal produce**. Conversely, urbanization has precipitated a massive shift toward **convenient delivery apps, ultra-processed ready meals, and sugary beverages**."
      },
      {
        "q": "How can we promote healthy eating habits?",
        "vi": "Chúng ta có thể thúc đẩy thói quen ăn uống lành mạnh bằng cách nào?",
        "a": "Governments can launch **educational health campaigns and enforce transparent food labeling**. Concurrently, subsidizing organic agricultural produce and taxing sugary refreshments will encourage wholesome consumer choices."
      }
    ]
  },
  {
    "id": "w-topic-15",
    "category": "ways",
    "categoryName": "Nhóm Cách Thức",
    "topicCode": "ĐỀ SỐ 15",
    "title": "There are some ways to reduce crime rates.",
    "center": "Reduce crime rates",
    "branches": [
      {
        "num": 1,
        "text": "improve education and training opportunities",
        "pos": "top",
        "type": "verb",
        "vi": "Nâng cao chất lượng giáo dục và đào tạo nghề"
      },
      {
        "num": 2,
        "text": "install surveillance cameras in public places",
        "pos": "right",
        "type": "verb",
        "vi": "Lắp đặt camera an ninh tại các khu vực công cộng"
      },
      {
        "num": 3,
        "text": "send criminals to prison",
        "pos": "bottom",
        "type": "verb",
        "vi": "Áp dụng hình phạt nghiêm khắc và cải tạo phạm nhân"
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
        "q": "Have you ever encountered a criminal in person?",
        "vi": "Bạn đã bao giờ trực tiếp gặp phải tội phạm chưa?",
        "a": "Fortunately, I have never been the direct victim of a violent crime. Nevertheless, I once **observed a petty theft in a crowded marketplace**, underscoring the necessity of perpetual situational awareness."
      },
      {
        "q": "What is the most common type of crime in your city?",
        "vi": "Loại tội phạm phổ biến nhất tại thành phố của bạn là gì?",
        "a": "In metropolitan areas, **property-related offenses such as motorcycle theft, pickpocketing, and sophisticated cyber-fraud schemes** represent the most pervasive forms of illicit activity."
      },
      {
        "q": "Do you consider your country to be a safe place to live?",
        "vi": "Bạn có coi đất nước của mình là một nơi an toàn để sinh sống không?",
        "a": "Undoubtedly. Vietnam boasts exceptional civil stability, largely attributed to **stringent firearms regulations and effective community policing**, allowing citizens to navigate public spaces safely at night."
      }
    ]
  },
  {
    "id": "c-topic-11",
    "category": "causes",
    "categoryName": "Nhóm Nguyên Nhân",
    "topicCode": "ĐỀ SỐ 11",
    "title": "There are some causes of overpopulation.",
    "center": "Overpopulation",
    "branches": [
      {
        "num": 1,
        "text": "decline in death rate",
        "pos": "top",
        "type": "noun",
        "vi": "Tỷ lệ tử vong giảm mạnh"
      },
      {
        "num": 2,
        "text": "lack of family planning",
        "pos": "right",
        "type": "noun",
        "vi": "Thiếu kiến thức kế hoạch hóa gia đình"
      },
      {
        "num": 3,
        "text": "better health care system",
        "pos": "bottom",
        "type": "noun",
        "vi": "Hệ thống chăm sóc y tế ngày càng hoàn thiện"
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
        "q": "What are some negative effects of overpopulation?",
        "vi": "Những tác động tiêu cực của việc bùng nổ dân số là gì?",
        "a": "Overpopulation precipitates severe **ecological degradation, urban slum proliferation, resource depletion, and acute infrastructure strain**, exacerbating competition for employment and basic amenities."
      },
      {
        "q": "What can be done to solve overpopulation?",
        "vi": "Có thể làm gì để giải quyết vấn đề bùng nổ dân số?",
        "a": "Policymakers must **expand reproductive healthcare accessibility, empower female educational enrollment**, and implement incentives encouraging sustainable family planning."
      },
      {
        "q": "Do developing countries suffer more from overpopulation than developed ones?",
        "vi": "Các nước đang phát triển có chịu ảnh hưởng nặng nề hơn các nước phát triển không?",
        "a": "Inarguably. Developing nations lack the **fiscal reserves and institutional resilience** required to accommodate rapid demographic surges, leading to widespread poverty and overburdened public utilities."
      }
    ]
  },
  {
    "id": "c-topic-12",
    "category": "causes",
    "categoryName": "Nhóm Nguyên Nhân",
    "topicCode": "ĐỀ SỐ 12",
    "title": "There are several reasons for divorce.",
    "center": "Divorce",
    "branches": [
      {
        "num": 1,
        "text": "lack of responsibility",
        "pos": "top",
        "type": "noun",
        "vi": "Thiếu tinh thần trách nhiệm với gia đình"
      },
      {
        "num": 2,
        "text": "financial burden",
        "pos": "right",
        "type": "noun",
        "vi": "Gánh nặng và áp lực tài chính"
      },
      {
        "num": 3,
        "text": "communication problems",
        "pos": "bottom",
        "type": "noun",
        "vi": "Bất đồng và thiếu giao tiếp thấu hiểu"
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
        "q": "What are some advantages of getting married?",
        "vi": "Những ưu điểm của việc kết hôn là gì?",
        "a": "Marriage provides **enduring emotional companionship, shared financial resources, and legal safeguards**, creating a nurturing foundation for cooperative parenting and personal fulfillment."
      },
      {
        "q": "How can people maintain a happy marriage?",
        "vi": "Làm thế nào để duy trì một cuộc hôn nhân hạnh phúc?",
        "a": "Sustaining marital harmony demands **transparent communication, mutual compromise, and emotional empathy**. Prioritizing dedicated couple time and sharing equitable domestic workloads reinforces partnership solidarity."
      },
      {
        "q": "Some people say young people today don’t want to get married. What do you think about this?",
        "vi": "Nhiều người nói giới trẻ ngày nay không muốn kết hôn. Bạn nghĩ gì về điều này?",
        "a": "This observation is largely accurate. Escalating economic pressures, housing unaffordability, and greater cultural acceptance of singlehood lead modern youths to **prioritize self-actualization and autonomy over traditional matrimonial obligations**."
      }
    ]
  },
  {
    "id": "c-topic-13",
    "category": "causes",
    "categoryName": "Nhóm Nguyên Nhân",
    "topicCode": "ĐỀ SỐ 13",
    "title": "Higher education should be free for everyone.",
    "center": "Free higher education",
    "branches": [
      {
        "num": 1,
        "text": "an equal chance for everyone",
        "pos": "top",
        "type": "noun",
        "vi": "Tạo cơ hội học tập bình đẳng cho mọi tầng lớp"
      },
      {
        "num": 2,
        "text": "a safer world",
        "pos": "right",
        "type": "noun",
        "vi": "Xây dựng một xã hội văn minh và an toàn hơn"
      },
      {
        "num": 3,
        "text": "solutions to unemployment",
        "pos": "bottom",
        "type": "noun",
        "vi": "Giải pháp hữu hiệu giúp giảm tỷ lệ thất nghiệp"
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
        "q": "Do you think it is reasonable to apply free higher education in Vietnam?",
        "vi": "Bạn có nghĩ rằng việc áp dụng miễn phí đại học ở Việt Nam là hợp lý không?",
        "a": "Immediate nationwide tuition elimination may strain Vietnam's public expenditure. A more prudent policy involves **expanding targeted merit scholarships and income-contingent loans** for underprivileged students."
      },
      {
        "q": "“University is the only way to success”. Do you agree?",
        "vi": "“Đại học là con đường duy nhất dẫn đến thành công”. Bạn có đồng ý không?",
        "a": "I firmly disagree. Higher education provides valuable advantages, but success can equally be attained through **vocational mastery, self-taught expertise, and entrepreneurial innovation**."
      },
      {
        "q": "Should lower education be free for everyone as well?",
        "vi": "Các bậc học thấp hơn có nên được miễn phí cho mọi người không?",
        "a": "Without question. Compulsory primary and secondary education represents a **foundational human right** that governments must guarantee unconditionally to eradicate illiteracy and social disparity."
      }
    ]
  },
  {
    "id": "c-topic-14",
    "category": "causes",
    "categoryName": "Nhóm Nguyên Nhân",
    "topicCode": "ĐỀ SỐ 14",
    "title": "Childhood is the most important time of a person’s life.",
    "center": "Childhood",
    "branches": [
      {
        "num": 1,
        "text": "develop physical health",
        "pos": "top",
        "type": "verb",
        "vi": "Phát triển thể chất và nền tảng sức khỏe"
      },
      {
        "num": 2,
        "text": "form personality",
        "pos": "right",
        "type": "verb",
        "vi": "Hình thành nhân cách, tính cách và đạo đức"
      },
      {
        "num": 3,
        "text": "learn things fast",
        "pos": "bottom",
        "type": "verb",
        "vi": "Khả năng tiếp thu và học hỏi nhanh nhất"
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
        "q": "How does childhood influence a person's future health?",
        "vi": "Tuổi thơ ảnh hưởng như thế nào đến sức khỏe tương lai của một người?",
        "a": "Early childhood health sets biological baselines. Adequate nourishment and physical exercise build **robust skeletal and cardiovascular systems**, while childhood neglect frequently manifests as **chronic adult illnesses**."
      },
      {
        "q": "In what ways does a child's personality develop during early years?",
        "vi": "Nhân cách của một đứa trẻ phát triển theo những cách nào trong những năm đầu đời?",
        "a": "Personality develops through **observational learning, social socialization, and parental modeling**. Consistent emotional validation nurtures **empathy, self-esteem, and social adaptability**."
      },
      {
        "q": "Why do children tend to learn new things more quickly than adults?",
        "vi": "Tại sao trẻ em có xu hướng học những điều mới nhanh hơn người lớn?",
        "a": "Young children benefit from **superior neuroplasticity and active synaptic connections**. Furthermore, unburdened by adult self-consciousness, they acquire knowledge through **uninhibited experimentation**."
      }
    ]
  },
  {
    "id": "c-topic-15",
    "category": "causes",
    "categoryName": "Nhóm Nguyên Nhân",
    "topicCode": "ĐỀ SỐ 15",
    "title": "Traditional music should be kept.",
    "center": "Traditional music",
    "branches": [
      {
        "num": 1,
        "text": "cultural values",
        "pos": "top",
        "type": "noun",
        "vi": "Lưu giữ bản sắc và giá trị văn hóa độc đáo"
      },
      {
        "num": 2,
        "text": "historical values",
        "pos": "right",
        "type": "noun",
        "vi": "Bảo tồn các chứng tích và giá trị lịch sử hào hùng"
      },
      {
        "num": 3,
        "text": "educational values",
        "pos": "bottom",
        "type": "noun",
        "vi": "Giá trị giáo dục đạo đức và tình yêu quê hương"
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
        "q": "What role does traditional music play in your country’s culture?",
        "vi": "Âm nhạc truyền thống đóng vai trò gì trong văn hóa đất nước bạn?",
        "a": "Traditional music forms the **quintessential spiritual fabric of Vietnamese cultural heritage**, playing an essential role in **national festivals, ancestral veneration, and communal rites**."
      },
      {
        "q": "How can we promote traditional music among younger generations?",
        "vi": "Làm thế nào để quảng bá âm nhạc truyền thống cho thế hệ trẻ?",
        "a": "Educators should **integrate traditional musical performance into school curricula**, while modern artists can **fuse traditional instruments with electronic or pop genres** to broaden youth appeal."
      },
      {
        "q": "Do you think traditional music is losing its popularity? Why or why not?",
        "vi": "Bạn có nghĩ rằng âm nhạc truyền thống đang mất dần sự phổ biến không? Tại sao?",
        "a": "Undeniably, traditional genres face fierce competition from **globalized commercial pop and streaming platforms**. Nonetheless, targeted cultural revival movements and modern fusion adaptations are steadily re-engaging younger demographics."
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
    { cat: 'Thân bài - Nhánh 1', front: 'One major quality is that...', back: 'Một phẩm chất quan trọng là...', ex: 'One major quality is that a good student has self-discipline.' },
    { cat: 'Thân bài - Nhánh 2', front: 'Another positive aspect / reason is that...', back: 'Một khía cạnh tích cực / lý do khác là...', ex: 'Another positive aspect is that e-learning is time-saving.' },
    { cat: 'Thân bài - Nhánh 2', front: 'Another practical method is to [verb]...', back: 'Một phương pháp thực tế khác là...', ex: 'Another practical method is to avoid unnecessary shopping.' },
    { cat: 'Thân bài - Nhánh 2', front: 'Another important quality is that...', back: 'Một phẩm chất quan trọng khác là...', ex: 'Another important quality is that a good student is eager to learn.' },
    { cat: 'Thân bài - Nhánh 3', front: 'One more beneficial effect / key element is that...', back: 'Thêm một tác động có lợi / yếu tố then chốt nữa là...', ex: 'One more beneficial effect is that distance learning is money-saving.' },
    { cat: 'Thân bài - Nhánh 3', front: 'One more useful approach is to [verb]...', back: 'Thêm một cách tiếp cận hữu ích nữa là...', ex: 'One more useful approach is to set a monthly budget.' },
    { cat: 'Thân bài - Nhánh 3', front: 'One more key strength is that...', back: 'Thêm một điểm mạnh then chốt nữa là...', ex: 'One more key strength is that a good student can manage time well.' },
    { cat: 'Mở rộng B2', front: '..., which is especially useful for...', back: 'Mệnh đề quan hệ giải thích lý do hoặc đối tượng hưởng lợi', ex: 'Students can study anytime, which is especially useful for those with busy schedules.' },
    { cat: 'Mở rộng B2', front: 'In fact, / To be specific, ...', back: 'Thực tế là / Cụ thể hơn là... (Dẫn dắt mở rộng ý)', ex: 'In fact, arriving on time shows that candidates are responsible.' },
    { cat: 'Mở rộng B2', front: 'Therefore, / As a result, ...', back: 'Do đó / Kết quả là... (Chỉ kết quả)', ex: 'As a result, they can balance their studies with other responsibilities.' },
    { cat: 'Kết bài B2', front: 'In short, [topic] has several clear benefits, as mentioned above.', back: 'Tóm lại, [chủ đề] có những lợi ích rõ ràng như đã nêu.', ex: 'In short, online learning has several clear benefits, as mentioned above.' },
    { cat: 'Follow-ups B2', front: 'In my opinion, ... / Personally, I think...', back: 'Theo ý kiến của tôi... (Bắt đầu trả lời câu hỏi mở rộng)', ex: 'In my opinion, self-discipline is the most important quality.' },
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
        "Trần Hoàng Thông",
        "Nguyễn Kim Tiền",
        "Lê Thị Bảo Trân",
        "Võ Thị Diễm Trinh",
        "Nguyễn Tiến Trung",
        "Trần Thị Ánh Tuyết",
        "Đặng Nguyễn Khánh Uyên",
        "Nguyễn Thị Chúc Yến",
        "Gia Tuệ"
    ],
    "B2": [
        "Gia Tuệ",
        "Gia Tuê",
        "Nguyễn Gia Tuệ",
        "Trần Gia Tuệ",
        "Lê Gia Tuệ"
    ]
};

// Các tab được mở quyền truy cập cho học viên (Mở Nhóm 1, Tổng quan và Công cụ; Khóa Nhóm 2-6)
const UNLOCKED_TABS_B212 = ['flower-garden', 'overview', 'group-benefits', 'tool-simulator', 'tool-flashcards'];

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
    const formattedClass = (classCode || '').toUpperCase().replace(/^(LỚP|LOP|CLASS)\s*/i, '').replace(/[^A-Z0-9]/g, '');
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

// Kiểm tra học viên Gia Tuệ (được mở khóa toàn bộ các nhóm bài học)
function checkIfGiaTue(name) {
    const normName = normalizeStr(name || '');
    return normName.includes('gia tue') || 
           normName.includes('gia tuê') || 
           normName.includes('gia tuệ') ||
           normName.replace(/\s+/g, '').includes('giatue') ||
           normName === 'tue' ||
           normName.endsWith(' tue');
}

// Kiểm tra quyền mở khóa toàn bộ (Giáo viên hoặc học viên Gia Tuệ / lớp B2)
function checkHasFullAccess() {
    if (state.student.isTeacher || state.student.hasFullAccess) return true;
    const isTeacher = checkIfTeacher(state.student.name, state.student.classCode);
    const isGiaTue = checkIfGiaTue(state.student.name);
    const isClassB2 = (state.student.classCode || '').toUpperCase() === 'B2';
    return isTeacher || isGiaTue || isClassB2;
}

// Áp dụng khóa/mở các nhóm đề thi
function applyAccessControl(hasFullAccess) {
    const navItems = document.querySelectorAll('.nav-item');
    const classCode = state.student.classCode || 'B212';
    navItems.forEach(item => {
        const target = item.dataset.target || item.getAttribute('data-target');
        const existingPill = item.querySelector('.lock-pill');
        if (existingPill) existingPill.remove();

        if (hasFullAccess || UNLOCKED_TABS_B212.includes(target)) {
            item.classList.remove('locked');
            item.removeAttribute('title');
        } else {
            item.classList.add('locked');
            item.setAttribute('title', `Tạm khóa cho lớp ${classCode}`);
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
    state.student.hasFullAccess = false;
    
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

        let formattedClass = classVal.toUpperCase()
            .replace(/^(LỚP|LOP|CLASS)\s*/i, '')
            .replace(/[^A-Z0-9]/g, '');
        const normName = normalizeStr(nameVal);

        // 1. Kiểm tra tài khoản Giáo viên (tên PTMN, mã lớp GV)
        const isTeacher = checkIfTeacher(nameVal, formattedClass);

        let finalName = '';
        let finalClass = '';

        if (isTeacher) {
            finalName = (normName === 'ptmn' || !nameVal) ? 'Cô Nguyệt (PTMN)' : nameVal;
            finalClass = formattedClass || 'GV';
            state.student.isTeacher = true;
            state.student.hasFullAccess = true;
        } else {
            // 2. Kiểm tra học viên thuộc lớp B212 hoặc B2
            const allowedClasses = ['B212', 'B2'];
            if (!allowedClasses.includes(formattedClass)) {
                if (errorMsg) {
                    errorMsg.textContent = 'Mã lớp không hợp lệ. Vui lòng kiểm tra lại!';
                    errorMsg.style.display = 'block';
                }
                if (classInput) classInput.focus();
                return;
            }

            let matchedStudent = null;
            const isGiaTue = checkIfGiaTue(nameVal);

            if (formattedClass === 'B2') {
                if (isGiaTue) {
                    matchedStudent = nameVal.trim() || 'Gia Tuệ';
                } else {
                    const roster = CLASS_STUDENTS['B2'] || [];
                    matchedStudent = roster.find(s => normalizeStr(s) === normName);
                }
            } else {
                const roster = CLASS_STUDENTS[formattedClass] || [];
                matchedStudent = roster.find(s => normalizeStr(s) === normName);
                if (!matchedStudent && isGiaTue) {
                    matchedStudent = nameVal.trim() || 'Gia Tuệ';
                }
            }

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
            state.student.hasFullAccess = (isGiaTue || formattedClass === 'B2');
        }

        if (errorMsg) errorMsg.style.display = 'none';

        state.student.name = finalName;
        state.student.classCode = finalClass;

        // Áp dụng quyền truy cập: mở Nhóm 1 cho B212, mở tất cả cho Gia Tuệ (lớp B2) và Giáo viên
        applyAccessControl(state.student.hasFullAccess);
        if (typeof window.refreshSimulatorTopics === 'function') {
            window.refreshSimulatorTopics(state.student.hasFullAccess);
        }

        // Nếu tab hiện tại đang bị khóa thì tự động chuyển về Nhóm 1
        const activeNav = document.querySelector('.nav-item.active');
        const currentTarget = activeNav ? activeNav.getAttribute('data-target') : 'overview';
        if (!state.student.hasFullAccess && !UNLOCKED_TABS_B212.includes(currentTarget)) {
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
        const hasFullAccess = checkHasFullAccess();
        if (!hasFullAccess && !UNLOCKED_TABS_B212.includes(targetId)) {
            showToast(`🔒 Nhóm bài học này đang tạm khóa cho lớp ${state.student.classCode || 'B212'} và sẽ được mở trong các buổi học tiếp theo!`);
            targetId = 'group-benefits';
        }

        navItems.forEach(i => {
            if (i.getAttribute('data-target') === targetId) {
                i.classList.add('active');
            } else {
                i.classList.remove('active');
            }
        });

        document.querySelectorAll('.tab-pane').forEach(p => {
            p.classList.remove('active');
            p.style.display = '';
        });
        const targetPane = document.getElementById(targetId);
        if (targetPane) {
            targetPane.classList.add('active');
            targetPane.classList.remove('hidden');
            targetPane.style.display = '';
            if (targetId === 'flower-garden' && window.FlowerGarden) {
                window.FlowerGarden.render();
            }
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

            const hasFullAccess = checkHasFullAccess();
            if (!hasFullAccess && !UNLOCKED_TABS_B212.includes(targetId)) {
                showToast(`🔒 Nhóm bài học này đang tạm khóa cho lớp ${state.student.classCode || 'B212'} và sẽ được mở trong các buổi học tiếp theo!`);
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

    window.refreshSimulatorTopics = function(hasFullAccess) {
        if (!topicSelect) return;
        topicSelect.innerHTML = '';

        const availableTopics = hasFullAccess 
            ? ALL_TOPICS_POOL 
            : ALL_TOPICS_POOL.filter(t => t.category === 'benefits');

        availableTopics.forEach((t) => {
            const opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = '[' + t.categoryName + '] ' + t.title;
            topicSelect.appendChild(opt);
        });

        // Với học viên B212: Hiển thị các chủ đề của nhóm 2-6 dưới dạng tạm khóa
        if (!hasFullAccess) {
            const lockedTopics = ALL_TOPICS_POOL.filter(t => t.category !== 'benefits');
            if (lockedTopics.length > 0) {
                const optGroup = document.createElement('optgroup');
                optGroup.label = `── 🔒 CÁC CHỦ ĐỀ ĐANG TẠM KHÓA (LỚP ${state.student.classCode || 'B212'}) ──`;
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

    window.refreshSimulatorTopics(checkHasFullAccess());

    if (topicSelect) {
        topicSelect.addEventListener('change', () => {
            const found = ALL_TOPICS_POOL.find(t => t.id === topicSelect.value);
            if (found) loadSimTopic(found);
        });
    }

    if (randomBtn) {
        randomBtn.addEventListener('click', () => {
            const hasFullAccess = checkHasFullAccess();
            const pool = hasFullAccess 
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
