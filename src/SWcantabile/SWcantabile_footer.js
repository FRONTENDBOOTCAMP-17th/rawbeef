document.getElementById('user-footer').innerHTML = `
  <footer class="bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-400 text-xs mt-8 border-t border-gray-200 dark:border-gray-800 transition-colors duration-200">
    <div class="max-w-6xl mx-auto px-5 py-8 xl:py-10">
      <div class="grid grid-cols-1 xl:grid-cols-[auto_1fr] gap-8 xl:gap-10">
        <!-- 1. 로고 + 약관 + 계열사 -->
        <div class="flex flex-col gap-4 items-center xl:items-start">
          <a href="./SWcantabile_song.html" class="no-underline"><span class="text-xl bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent" style="font-family: 'Jalnan2', sans-serif;">SW</span><span class="text-lg text-orange-600" style="font-family: 'Jalnan2', sans-serif;">칸타빌레</span></a>
          <ul class="flex flex-wrap gap-x-4 gap-y-1 list-none p-0 m-0 justify-center xl:justify-start">
            <li><span class="text-gray-500 text-xs">이용약관</span></li>
            <li><span class="text-gray-500 text-xs">개인정보처리방침</span></li>
            <li><span class="text-gray-500 text-xs">환불규정</span></li>
          </ul>
        </div>

        <!-- 2. 회사 정보 (lg에서 2행 span) -->
        <div class="xl:row-span-2 text-center xl:text-left">
          <h6 class="text-gray-800 dark:text-gray-300 text-sm font-bold mb-3 mt-0">SW칸타빌레㈜</h6>
          <p class="flex flex-col xl:flex-row xl:flex-wrap gap-y-1 xl:gap-x-6 xl:gap-y-2 mb-1 text-xs leading-relaxed text-gray-600 dark:text-gray-500 items-center xl:items-start">
            <span> 제작자 : 박소유, 이우현 </span>
            <span>mogoa97@naver.com</span>
            <span>연락처 : 010-7774-0699</span>
          </p>
          <p class="flex flex-col xl:flex-row xl:flex-wrap gap-y-1 xl:gap-x-6 xl:gap-y-2 mb-2 text-xs leading-relaxed text-gray-600 dark:text-gray-500 items-center xl:items-start">
            <span>도움을 주신분 : 김성박 강사님</span>
            <span></span>
          </p>
        </div>

        <!-- 3. SNS + 카피라이트 (모바일/태블릿 맨 아래, lg에서 섹션1 아래) -->
        <div class="flex flex-col gap-2 items-center xl:items-start">
          <ul class="flex gap-2.5 list-none p-0 m-0">
            <li>
          
              <a href="https://www.instagram.com/sosoyuyu1997/" target="_blank" title="인스타그램" class="inline-flex w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 items-center justify-center text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white no-underline transition-colors duration-150">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </li>
          </ul>
          <p class="text-gray-500 dark:text-gray-600 text-[11px] xl:text-xs m-0 mt-4">Copyrightⓒ 2026 SW cantabile All Rights Reserved.</p>
        </div>
      </div>
    </div>
  </footer>
`;
