const doctorSearchForm = ({exactMatch, queryLang}) => {
  return `
    <form id='doctor-search'>
      <div class='doctor-search-engine'>
        <input dir='auto' type='search' class='doctor-search-input' name='search' placeholder='ابحث'>
        <button for='search' class='search-btn' type='submit'>
          <i class="fa fa-search"></i>
        </button>
      </div>
      <ul class='doctor-search-options'>
        <li class='option'>
          <input type='checkbox' name='exactMatch' id='exactMatch' ${
            exactMatch && 'checked'
          }>
          <label tabindex='0' for='exactMatch'>مطابقة اللفظ</label>
        </li>
        <li class='option'>
          <input type='checkbox' id='search-direction'>
          <label tabindex='0' for='search-direction'>جهة البحث</label>
          <ul class='option-data'>
            <li>
              <input type='radio' id='ar' name='queryLang' value='arText' ${
                queryLang === 'arText' && 'checked'
              }>
              <label tabindex='0' for="ar">كتب العرب</label>
            </li>
            <li>
              <input type='radio' id='foreign' name='queryLang' value='frnText' ${
                queryLang === 'frnText' && 'checked'
              }>
              <label tabindex='0' for="foreign">تراجم العجم</label>
            </li>
          </ul>
        </li>
      </ul>
    </form>
  `;
};
{
  /* <input type='radio' id='books'>
        <label for='books'>الكتب</label>
        <ul class='option'>
          <li>
            <input type='checkbox' id='abook' name='bookName' value='131'>
            <label for="abook">مفتاح الطب</label>
          </li>
        </ul> */
}
