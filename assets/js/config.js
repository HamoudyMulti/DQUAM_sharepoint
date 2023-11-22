"use strict";

/* -------------------------------------------------------------------------- */

/*                              Config                                        */

/* -------------------------------------------------------------------------- */
var CONFIG = {
  isNavbarVerticalCollapsed: false,
  theme: 'light',
  isRTL: false,
  isFluid: true,
  navbarStyle: 'transparent',
  navbarPosition: 'vertical'
};
Object.keys(CONFIG).forEach(function (key) {
  if (localStorage.getItem(key) === null) {
    localStorage.setItem(key, CONFIG[key]);
  }
});

if (JSON.parse(localStorage.getItem('isNavbarVerticalCollapsed'))) {
  document.documentElement.classList.add('navbar-vertical-collapsed');
}

if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.setAttribute('data-bs-theme', 'dark');
}
//# sourceMappingURL=config.js.map

/* -------------------------------------------------------------------------- */

/*                              Language                                        */

/* -------------------------------------------------------------------------- */

// JSON.parse(localStorage.getItem('isRTL')

document.addEventListener("DOMContentLoaded", () => {

    let langSelector = document.getElementById("langSelector");

    // selected option on load
    if (localStorage.getItem("isRTL") === "false") {
        langSelector.value = "english";
    } else {
        langSelector.value = "arabic";
    }

    // select on change
    function changeLang() {
        if( langSelector.value === "english" ) {
            localStorage.setItem( "isRTL", false);
        } else {
            localStorage.setItem( "isRTL", true);
        }

        window.location.reload();
    }

    langSelector.addEventListener("change", changeLang);

});

/* -------------------------------------------------------------------------- */

/*                          Editable Card forms                               */

/* -------------------------------------------------------------------------- */
function initEditableCards() {
    let node = $(".card-editable");
    
    if(node.length < 1){
        return;
    }

    node.each(function () {
        let thisCard = $(this);
        let dataEdit = thisCard.find(".data-edit");
        let dataView = thisCard.find(".data-view");
        let btnEdit = thisCard.find(".btn-edit");
        let btnSave = thisCard.find(".btn-save");
        
        // onload
        if( dataEdit.hasClass("active") ) {
            thisCard.attr("data-mode", "edit");
        } else {
            thisCard.attr("data-mode", "view");
        }

        // on click
        btnEdit.on("click", function () {
            thisCard.attr("data-mode", "edit");
            dataView.removeClass("active");
            dataEdit.addClass("active");
        });
        btnSave.on("click", function () {
            thisCard.attr("data-mode", "view");
            dataEdit.removeClass("active");
            dataView.addClass("active");
        });
        

        /*
        function setCardMode() {
            if(isCardEditable) {
                btnEdit.hide();
                btnSave.show();
            } else {
                btnEdit.show();
                btnSave.hide();
            }
        }

         	

        btnEdit.on("click", function () {
            setCardMode();
        });
        */

        

    });
}


$(function () {
    initEditableCards();
});


/* -------------------------------------------------------------------------- */

/*                         Stantards Management                               */

/* -------------------------------------------------------------------------- */
/*
function initStandardsManagementTabs() {
    let node = $(".standards-management-nav-cards");
    
    if(node.length < 1){
        return;
    }

    // Tabs Interaction
    let navItem = node.find(".each-nav-item");
    let contentItem = $(".standards-management-content-cards").find(".each-content-item");

    navItem.on("click", function () {
        $(this).siblings().removeClass("active");
        $(this).addClass("active");

        //alert( $(this).index() );
        let activeIndex = $(this).index();

        contentItem.hide();
        contentItem.eq(activeIndex).show();
    });

}


$(function () {
    initStandardsManagementTabs();
});
*/

/* -------------------------------------------------------------------------- */

/*                           Nested Accordion                                */

/* -------------------------------------------------------------------------- */
/*
function initNestedAccordion() {
    let node = $(".nested-accordion");
    
    if(node.length < 1){
        return;
    }

    

}


$(function () {
    initNestedAccordion();
});
*/
/* -------------------------------------------------------------------------- */

/*                              Search Filter                                      */

/* -------------------------------------------------------------------------- */
/*
document.addEventListener("DOMContentLoaded", () => {

    let searchFilterParent = document.getElementsByClassName("search-filter-parent");

    Array.from(searchFilterParent).forEach(function (searchFilterParent) {
        searchFilterParent.addEventListener('click', searchFilter);
    });

    function searchFilter() {
        console.log("working...");
    }

});
*/