//test_xdev.js

const xdev = require('./xdev.js')

//test jwt over jwt

const key = xdev.random()
console.log('key:', key)


const msg = `Saudi Arabia wants to be a bigger player in the Middle East — this time with diplomacy
By Nadeen Ebrahim, CNN
Updated 11:35 AM EDT, Wed May 3, 2023



A Saudi Navy sailor carries a child as evacuees arrive at King Faisal Navy Base in Jeddah on April 26 following a rescue operation from Sudan.
A Saudi Navy sailor carries a child as evacuees arrive at King Faisal Navy Base in Jeddah on April 26 following a rescue operation from Sudan.
Amer Hilabi/AFP/Getty Images
Editor’s Note: A version of this story appears in CNN’s Meanwhile in the Middle East newsletter, a three-times-a-week look inside the region’s biggest stories. Sign up here.

Abu Dhabi, UAE
CNN
 — 
When Iranian evacuees from Sudan were being flown out of Saudi Arabia on Saturday, a top Saudi military official went as far as boarding their plane back home to bid them a warm farewell.

“(This is) your country,” the kingdom’s Western Region Commander Major General Ahmed Al-Dabais declared to the departing Iranians as he held hands with Hassan Zarangar, Iran’s charge d’affaires to the kingdom. “If you need anything in Saudi, you’re most welcome… Iran and Saudi, they are brothers.”

Sixty-five Iranians evacuated from Sudan by the Saudi military were welcomed in the Saudi Red Sea city of Jeddah with flowers, images of which were broadcast on both Iranian and Saudi state television. Dabais told Zarangar that the friendly welcome for the Iranians was “from the directives of the leadership, from the king, from the crown prince.”

Such images would have been inconceivable just months ago, when Iran and Saudi Arabia were bitter regional foes engaging in multiple proxy conflicts across the Middle East. But the two buried the hatchet in March with Chinese mediation after nearly seven years of hostility, and hope to re-open embassies soon.

“This can only bring goodwill from the Iranians with the hope that it will be reciprocated,” Ali Shihabi, a Saudi analyst and writer, told CNN.

The kingdom is now on a mission to revamp its global image and mend fences with former foes.

The diplomatic efforts are the latest in a series of moves that position Riyadh in a peacemaking role, which analysts say is a strategic pivot away from more than a decade of a confrontational and interventionist foreign policy.

“There is a new foreign policy at play here,” Anna Jacobs, senior Gulf analyst at the Brussels-based International Crisis Group think tank, told CNN. “Saudi Arabia is seeking to assert itself more and more on the international stage through mediation and raising its diplomatic profile.”

Riyadh’s new foreign policy is more independent and prioritizes Saudi interests, she said.

Sudan diplomacy
The kingdom’s latest attempt at diplomacy came in Sudan, where forces loyal to two rival generals, Sudanese Armed Forces (SAF) commander Abdel Fattah Al-Burhan and Mohamed Hamdan Dagalo, head of the Rapid Support Forces (RSF), are vying for control. Hundreds have been killed and thousands injured in the fighting.

In images broadcast widely across Saudi news outlets, Saudi Arabian forces were seen evacuating thousands of evacuees from Port Sudan to the coastal city of Jeddah, a 12-hour journey across the Red Sea. Men, women and children were given Saudi flags to wave as cameras documented their arrival.

The kingdom on Monday said that it has evacuated more than 5,000 people from over 100 nationalities.

“We will do whatever we can to alleviate this crisis,” Fahad Nazer, spokesman for the Saudi embassy in the US, told CNN’s Becky Anderson on Tuesday. “We are leading this effort, but we are working very closely with the United States and our regional and international partners.”

Saudi Arabia's Mukaab (the cube) skyscraper at the heart of the New Murabba, in the capital Riyadh. 
Space pods and flying dragons: How Saudi Arabia wants to transform its capital
With the help of the United States, Saudi Arabia last week also mediated a brief truce between Sudan’s SAF commander Al-Burhan and RSF chief Dagalo. The truce was extended for another 72 hours on Monday, and the kingdom is reportedly joining the United Arab Emirates, the US and Egypt in efforts to broker a truce between the two commanders.

“The Saudi effort in Sudan was an opportunity to put Saudi’s considerable resources in the Red Sea at the international community’s disposal to help,” said Shihabi. “And that can only reflect well on the Kingdom.”

This new diplomacy comes as Saudi Arabia prioritizes economic growth at home, which requires regional stability to succeed. The $1 trillion economy has been on a quest to move away from its traditional reputation as a conservative, combative oil producer, and towards a global economic player and key regional tourism and business hub.

Its former interventionist policies, Jacobs said, only “led to greater regional instability and increased security threats against Saudi Arabia.”

Aside from Iran, Riyadh is mending ties with Yemen’s Houthis, Turkey and Syria’s regime. It has been spearheading efforts to bring Syria’s pariah President Bashar al-Assad back into the Arab fold over a decade after severing ties with it.

And last month, senior leaders from the Palestinian militant group Hamas were seen performing an Islamic pilgrimage in Mecca. Two days later, Palestinian Authority President Mahmoud Abbas met Saudi Crown Prince Mohammed bin Salman, known as MBS, in the nearby city of Jeddah. Hamas and the Palestinian Authority have been at odds for over a decade. Saudi Arabia’s ties with Hamas had been strained for the past decade too.

Credibility challenges
Riyadh’s mediation efforts have also gone beyond the Middle East. Last year, the government said it brokered a prisoner swap between Russia and Ukraine that saw 10 detainees released, including two American veterans and five British citizens.

The kingdom in December said that it also helped mediate the release of basketball star player Brittney Griner from Russian detention, in exchange for Russian arms dealer Viktor Bout.

Saudi efforts at revamping its image as a peace-broker may face credibility challenges, however, given its near decade-long combative foreign policy and the bad press it attracted.

As peace talks between Yemen’s Houthis and the Saudi delegation took place in the Yemeni capital Sanaa last month, Houthi officials were keen to point out that Saudi Arabia is not a mediator in the Yemen conflict, as it has claimed, but rather a participant.

A general view during Mdlbeast Soundstorm 2021 on December 19, 2021 in Riyadh, Saudi Arabia. 
Why the birthplace of Islam is hosting one of the world's biggest raves
The kingdom is now trying to extricate itself from Yemen after intervening in the civil war there in 2015 following the Houthi takeover of Sanaa. In that war, it mobilized an Arab coalition that included Sudan’s RSF. That group is party to the Sudan conflict that Saudi Arabia is trying to help end.

Asked by CNN whether the kingdom bears any responsibility for the Sudan conflict given its connections to RSF, Nazer of the Saudi embassy in the US said the kingdom is “engaged with all relevant parties in Sudan” and that Riyadh is “trying to promote an inclusive political process and dialogue that will restore peace and stability to Sudan.”

“We’re really frankly not looking backwards,” he said.

Despite its controversial past, Saudi Arabia may still carry enough influence to bring quarreling parties to the negotiating table, analysts say. The oil producer is home to Islam’s holiest sites and is one of the richest Arab nations. It has used its wealth to build bridges with some of its former foes, especially after a brief surge in oil prices that followed Russia’s invasion of Ukraine last year.

“Saudi (Arabia) does not pretend to be an impartial mediator but its voice carries weight with many parties in the region,” Shihabi said, adding that where it can, Saudi Arabia wants to use that influence to reduce tensions.

With additional reporting by CNN’s Mostafa Salem and Zeena Saifi`





const data = {
  name:'mutita',
  age:55,
  sex:'male',
  country:'Thailand'
}


xdev.$({encrypt:JSON.stringify(data) , userKey:key}).then(
  cipher => console.log(cipher)
)