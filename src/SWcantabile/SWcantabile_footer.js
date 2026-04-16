document.getElementById('user-footer').innerHTML = `
  <footer class="bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-400 text-xs mt-8 border-t border-gray-200 dark:border-gray-800 transition-colors duration-200">
    <div class="max-w-6xl mx-auto px-5 py-8 xl:py-10">
 <div class="flex flex-col xl:flex-row items-center xl:items-start justify-center gap-8 xl:gap-16 text-center xl:text-left">
        <!-- 1. 로고 + 약관 + 계열사 -->
        <div class="flex flex-col gap-4 items-center xl:items-start">
          <a href="./SWcantabile_song.html" class="no-underline"><span class="text-xl bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent" style="font-family: 'Jalnan2', sans-serif;">SW</span><span class="text-lg text-orange-600" style="font-family: 'Jalnan2', sans-serif;">칸타빌레</span></a>
       
        </div>

        <!-- 2. 회사 정보 (lg에서 2행 span) -->
        <div class="xl:row-span-2 text-center xl:text-left ">
      
          <p class="flex flex-col xl:flex-row xl:flex-wrap gap-y-1 xl:gap-x-6 xl:gap-y-2 mb-1 text-xs leading-relaxed text-gray-600 dark:text-gray-500 items-center xl:items-start">
            <span> 제작자 : 박소유, 이우현 </span>
            <span>mogoa97@naver.com</span>
            <span>연락처 : 010-7774-0699</span>
          </p>
          <div class="flex flex-col xl:flex-row xl:flex-wrap gap-y-1 xl:gap-x-6 xl:gap-y-2 mb-2 text-xs leading-relaxed text-gray-600 dark:text-gray-500 items-center xl:items-start">
            <span>도움을 주신분 : 김성박 강사님</span>
            <p class="text-gray-500 dark:text-gray-600 text-[11px] xl:text-xs m-0 mt-4">Copyrightⓒ 2026 SW cantabile All Rights Reserved.</p>
          </div>
        </div>

      

      </div>
    </div>
  </footer>
`;
