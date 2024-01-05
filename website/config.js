// xv is a global var foXVr template

globalThis.xv = {}

xv.contentKeep = {
  html: '',
  scrollPosition: 0
}

xv.picPath = '/pic/'
xv.pendingApprovalFor = ''

xv.template = {
  log_in: `<div class=""><h1>Please log in</h1>\n  <p>Before you can do anything beyond the browsing for general contents you have to log-in first so that you can do everything this platform provides.</p>\n  <br>\n  <label>Username</label> <input class="w3-input w3-border" id="user_name" type="text"><br>\n  <label>Password</label> <input class="w3-input w3-border" id="pass_word" type="password" onchange="xb.hash(this.value).then(h => xb.secure.passwordHash = h).then(this.value = '')">\n  <br><br>\n  <button class="w3-btn w3-blue" onclick="login()">Log in</button> &nbsp; <button class="w3-btn w3-yellow" onclick="contentSet('close')">Close</button></div><hr>
  <p>If you don't have account yet after filled your desired username & password above then click sign-up below:</p>
  <button class="w3-btn w3-green" onclick="signUp()">Sign up</button><br>
  <hr>
  <p>If you forget your password please click below:</p>
  <button class="w3-btn w3-orange" onclick="forgotPassword()">Forgot password</button>`,
  
  card: `<pic-frame>
  <img src="" style="width:100%; cursor: pointer;" onclick="chooseItem(this)">
  <pic-mark></pic-mark>

  <quick-order>
    <order-qty>
      <button style="padding-top:0; padding-bottom:0; border-radius:16px" class="w3-pale-yellow" onclick="cancelItem(this)">Cancel</button> &nbsp;&nbsp; <button style="width:100px; padding-top:0px; padding-bottom:0px; border-radius:16px 0 0 16px" onclick="orderQty(this,'-')">&minus;</button><button style="width:100px; padding-top:0; padding-bottom:0; border-radius:0 16px 16px 0" onclick="orderQty(this,'+')">&plus;</button>
    </order-qty>
    <div class="w3-xxlarge w3-text-pink" style="position:absolute; right:8px; bottom:8px;">
      <qty>1</qty> <check></check>
    </div>
  </quick-order>
</pic-frame>

<div class="w3-container">
  <card-name title="Click to see product's detail."></card-name> &nbsp; <vendor-logo title="Click to see vendor's detail."></vendor-logo> &nbsp; <special-tag></special-tag> <price-tag></price-tag> &nbsp;&nbsp; <review></review><br>

  <card-brief></card-brief> &nbsp; <more title="Click to see more detail of this product."></more>
</div><br><br>`,

  profile: `<div class="w3-container">
<h1>My profile</h1>
<div>My picture <input id="get_profile_pic" type="file" accept="image/*" onchange="xb.readPicFileAsDataUrl(this).then(durl => profile_pic.src = durl)"> </div>
<div><img id="profile_pic" width="160"></div>
<div>My username <input class="w3-input w3-border" type="text"> </div>
<div>Change password <input class="w3-input w3-border" type="password"> </div>
<div>My email <input type="email" class="w3-input w3-border"> </div>
<div>My timezone <input class="w3-input w3-border" type="text"> </div>
<div>My city <input class="w3-input w3-border" type="text"> </div>
<div>My country <input class="w3-input w3-border" type="text"> </div>
<br>
<button class="w3-btn w3-blue" onclick="saveProfile()">Save</button> &nbsp; <button class="w3-btn w3-gray" onclick="contentSet('close')">Close</button>
<hr>
<div>Log</div>
</div>`,

  my_business: `<div class="w3-container">
    <h1>My business</h1>
    <p>This page is to setting everything about the user's business</p>
    <br>
    <button class="w3-btn w3-blue">Save</button> &nbsp; <button class="w3-btn w3-gray" onclick="contentSet('close')">Close</button>
  </div>`,

  products: `<div class="w3-container">
  <h1>My products</h1>
  <p>This page is to setting everything about the user's products</p>
  <br>
  <button class="w3-btn w3-blue">Save</button> &nbsp; <button class="w3-btn w3-gray" onclick="contentSet('close')">Close</button>
</div>`,

  sales: `<div class="w3-container">
  <h1>Sales</h1>
  <p>This page is for evyerthing about sales of the user.</p>
  <br>
  <button class="w3-btn w3-blue">Save</button> &nbsp; <button class="w3-btn w3-gray" onclick="contentSet('close')">Close</button>
</div>`,

  basket: `<div class="w3-container">
  <h1>Your basket</h1>
  <p>This is basket page showing what you're buying so far then you can proceed for checking/order the stuff.</p>
  <br>
  <button class="w3-btn w3-blue">Order</button> &nbsp; <button class="w3-btn w3-gray" onclick="contentSet('close')">Close</button>
  </div>`,

  more_item: `<div class="w3-container">
  <h1>More items</h1>
  <p>This page shows menu that beyonds the space of the main menu box</p>
  <br>
  <button class="w3-btn w3-blue" onclick="loadJustNote()">Just a note -- save notes to mutita.justNote db</button>
   
  <br><br>

  <hr>
  <button class="w3-btn w3-gray" onclick="contentSet('close')">Close</button>
  </div>`,

  writer: `<h3>Writes a story here</h3>

  <!-- Create the editor container -->
  <div id="editor"></div><br>
  <label>Tag</label> <input id="tagg" type="text" size="35">
  
  <div style="margin-top:8px">
    <button onclick="wrtierSave()">Save</button> <button onclick="document.querySelector('.ql-editor').innerHTML=''">Clear</button> 
  </div>
  
  <hr>
  <code id="dataa"></code>
  
  
  <!-- Initialize Quill editor -->
  <script>
    var quill = new Quill('#editor', 
      {
        theme: 'snow',
        placeholder: 'Writes your story here...',
        modules: {
          toolbar: [
            {'header':[false,1,2]},
            {'font':[]},
            //{'size':['large',false,'huge','small']},
            'bold','italic','underline',
            {'color':[]},{'background':[]},
            {'list':'ordered'},{'list':'bullet'},
            {'align':[]},
            'code-block','link','image','video'
          ]
        }
      }
    );
  
  
    function save() {
      let oj = {
        html: document.querySelector('.ql-editor').innerHTML,
        tag:  tagg.value
      }
      console.log(oj)
      
      let svReply = xb.send({
        act:  'save_story',
        data: oj
      })
  
      alert(svReply.msg)
    }
  </script>`,
  
  just_note: `<div class="w3-container">
  <h3>justNote 0.1</h3>
  <form id="just_note">
    Note*<br>
    <textarea name="note" rows="12" style="width:100%" placeholder="Put your note here..."></textarea>
    Tag <input name="tag" type="text" size="30"><br>
    By &nbsp;<input name="by" type="text" value="M">
  </form>
  <br>
  <button class="w3-btn w3-blue" onclick="saveJustNote(); just_note.reset()">Save</button> <button class="w3-btn w3-yellow" onclick="just_note.reset()">Clear</button> &nbsp;&nbsp; <button class="w3-btn w3-gray" onclick="contentSet('close')">Close</button>
  </div>`,

  message_card: {
    html: `<i class="fa fa-user-circle-o w3-xxxlarge w3-margin w3-display-topleft"></i><br>
    <p class="w3-xlarge w3-margin-left w3-display-topleft" style="margin-top:70px" _sender=""></p>
    <p class="w3-xlarge w3-text-black" style="margin-left:80px" _message=""></p>
    <span class="w3-display-bottomright w3-margin-right w3-text-brown" _time=""></span>`,
    cardClass: `w3-card-4 w3-container w3-section w3-display-container`,
    cardStyle: "min-height:130px",
    defaultColorClass: "w3-pale-green"
  },

  approve_card: {
    html: `<h1 _title="" class="w3-serif w3-text-red"><i>Please approve this</i></h1>
    <p>This needs to be approved ASAP because it's important.</p>
    <br>
    <form class="w3-xlarge">
      <input type="radio" value="yes" name="action" class="w3-radio"> Yes, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input type="radio" value="no" name="action" class="w3-radio"> No
    </form>
      
    <br>
    <br>
    <button class="w3-btn w3-margin-bottom w3-blue" onclick="xyz(this)">Confirm my action</button><br>
    <span msg=""></span>
    `,
    class:"w3-card-4 w3-container w3-display-container w3-pale-blue w3-section",
    style:'',
    attribute: {name: 'approve_card'},
    script:`function xyz(el) {
      let cardEl = el.closest('div[name="approve_card"]')
      if (cardEl.querySelector('form').action.value == '') {
        cardEl.querySelector('[msg]').textContent = "You haven't choose anything, please choose one."  
      } else {
        cardEl.querySelector('[msg]').textContent = "You have choosen: " + cardEl.querySelector('form').action.value
      }
       
    }`
  }

}

//change _ to - in html
xv.class = {
  pic_mark:     "w3-xxlarge w3-opacity w3-text-gray",
  qty:          "w3-white w-padding",
  check:        "fa fa-check-circle",
  card_name:    "w3-xxlarge",
  vendor_logo:  "w3-xlarge",
  special_tag:  "w3-tag w3-small w3-red", //color can change
  price_tag:    "w3-tag w3-small w3-blue",
  star:         "fa fa-star w3-xlarge",
  star_half:    "fa fa-star-half-o w3-xlarge",
  card_brief:   "w3-large",
  more:         "fa fa-ellipsis-h w3-tag w3-light-gray w3-text-gray w3-xlarge"
}