/* Bible Fun v2.0.0 - Master Database (250+ Items) */
const BibleDatabase = [
    // --- TOPIC: HEROES ---
    // clue = Jeopardy-style statement (host reads this; contestant says "Who is..." or "What is..."). Trivia/others use q and a.
    { id:"h1", topic:"Heroes", difficulty:1, type:"multiple", q:"Who built the ark?", clue:"This man built an ark to survive the flood.", a:"Noah", distractors:["Moses","Paul","Peter"] },
    { id:"h2", topic:"Heroes", difficulty:2, type:"multiple", q:"Who killed Goliath?", clue:"This young shepherd defeated a giant with a sling.", a:"David", distractors:["Saul","Solomon","Samuel"] },
    { id:"h3", topic:"Heroes", difficulty:3, type:"multiple", q:"Who was swallowed by a great fish?", clue:"This prophet was swallowed by a great fish.", a:"Jonah", distractors:["Noah","Job","Daniel"] },
    { id:"h4", topic:"Heroes", difficulty:4, type:"multiple", q:"Who had a coat of many colors?", clue:"This son of Jacob had a coat of many colors.", a:"Joseph", distractors:["Benjamin","Reuben","Dan"] },
    { id:"h5", topic:"Heroes", difficulty:5, type:"multiple", q:"Who was the first to see the resurrected Jesus?", clue:"She was the first to see Jesus after His resurrection.", a:"Mary Magdalene", distractors:["Peter","John","Thomas"] },
    { id:"h6", topic:"Heroes", difficulty:1, type:"multiple", q:"Who was the strongest man?", clue:"This judge of Israel was known for his great strength.", a:"Samson", distractors:["Goliath","Saul","David"] },
    { id:"h7", topic:"Heroes", difficulty:2, type:"multiple", q:"Who was the first man?", clue:"He was the first man God created.", a:"Adam", distractors:["Cain","Seth","Noah"] },
    { id:"h8", topic:"Heroes", difficulty:1, type:"multiple", q:"Who led the Israelites out of Egypt?", clue:"This man led the Israelites out of Egypt.", a:"Moses", distractors:["Aaron","Joshua","Caleb"] },
    { id:"h9", topic:"Heroes", difficulty:2, type:"multiple", q:"Who was thrown into a lions' den?", clue:"This prophet was thrown into a lions' den.", a:"Daniel", distractors:["Shadrach","Meshach","Abednego"] },
    { id:"h10", topic:"Heroes", difficulty:3, type:"multiple", q:"Who wrestled with an angel all night?", clue:"This patriarch wrestled with an angel all night.", a:"Jacob", distractors:["Abraham","Isaac","Esau"] },
    { id:"h11", topic:"Heroes", difficulty:2, type:"multiple", q:"Who was sold into Egypt by his brothers?", clue:"This son of Jacob was sold into Egypt by his brothers.", a:"Joseph", distractors:["Benjamin","Reuben","Simeon"] },
    { id:"h12", topic:"Heroes", difficulty:4, type:"multiple", q:"Who was taken up to heaven in a chariot of fire?", clue:"This prophet was taken up to heaven in a chariot of fire.", a:"Elijah", distractors:["Elisha","Moses","Enoch"] },
    { id:"h13", topic:"Heroes", difficulty:1, type:"multiple", q:"Who parted the Red Sea?", clue:"This man parted the Red Sea.", a:"Moses", distractors:["Joshua","Aaron","Caleb"] },
    { id:"h14", topic:"Heroes", difficulty:3, type:"multiple", q:"Who was the mother of Samuel?", clue:"She was the mother of Samuel.", a:"Hannah", distractors:["Rachel","Leah","Ruth"] },
    { id:"h15", topic:"Heroes", difficulty:2, type:"multiple", q:"Who defeated the Midianites with 300 men?", clue:"This judge defeated the Midianites with 300 men.", a:"Gideon", distractors:["Samson","Deborah","Jephthah"] },
    { id:"h16", topic:"Heroes", difficulty:4, type:"multiple", q:"Who interpreted Pharaoh's dreams?", clue:"This Hebrew interpreted Pharaoh's dreams in Egypt.", a:"Joseph", distractors:["Daniel","Moses","Samuel"] },
    { id:"h17", topic:"Heroes", difficulty:3, type:"multiple", q:"Who was the father of John the Baptist?", clue:"He was the father of John the Baptist.", a:"Zechariah", distractors:["Joseph","Joachim","Eli"] },
    { id:"h18", topic:"Heroes", difficulty:5, type:"multiple", q:"Who was the Ethiopian eunuch baptized by Philip?", clue:"Philip baptized this Ethiopian eunuch.", a:"No name given", distractors:["Cornelius","Simeon","Eunice"] },

    // --- TOPIC: ANIMALS ---
    { id:"a1", topic:"Animals", difficulty:1, type:"multiple", q:"What bird did Noah send out first from the ark?", clue:"Noah sent this bird out first from the ark.", a:"Raven", distractors:["Dove","Sparrow","Eagle"] },
    { id:"a2", topic:"Animals", difficulty:2, type:"multiple", q:"Which animal spoke to Balaam?", clue:"This animal spoke to Balaam.", a:"Donkey", distractors:["Camel","Sheep","Horse"] },
    { id:"a3", topic:"Animals", difficulty:3, type:"multiple", q:"What animal did Aaron fashion out of gold for the Israelites?", clue:"Aaron fashioned this animal out of gold for the Israelites.", a:"Calf", distractors:["Lamb","Lion","Bull"] },
    { id:"a4", topic:"Animals", difficulty:4, type:"multiple", q:"What did the prodigal son want to eat along with the pigs?", clue:"The prodigal son wanted to eat these along with the pigs.", a:"Pods", distractors:["Corn","Bread","Apples"] },
    { id:"a5", topic:"Animals", difficulty:5, type:"multiple", q:"In Revelation, what color was the horse whose rider was named Death?", clue:"In Revelation, the horse whose rider was named Death was this color.", a:"Pale", distractors:["Red","Black","White"] },
    { id:"a6", topic:"Animals", difficulty:1, type:"multiple", q:"What animal did God provide for Abraham instead of Isaac?", clue:"God provided this animal for Abraham to sacrifice instead of Isaac.", a:"Ram", distractors:["Lamb","Goat","Bull"] },
    { id:"a7", topic:"Animals", difficulty:2, type:"multiple", q:"What did Jesus say we should consider to learn about worry?", clue:"Jesus said to consider these to learn about worry.", a:"Birds of the air", distractors:["Fish of the sea","Lilies","Sheep"] },
    { id:"a8", topic:"Animals", difficulty:3, type:"multiple", q:"What animal did Samson use to strike the Philistines?", clue:"Samson used the jawbone of this animal.", a:"Donkey", distractors:["Lion","Ox","Sheep"] },
    { id:"a9", topic:"Animals", difficulty:4, type:"multiple", q:"What kind of creature tempted Eve in the garden?", clue:"This creature tempted Eve in the garden.", a:"Serpent", distractors:["Dragon","Lizard","Raven"] },
    { id:"a10", topic:"Animals", difficulty:2, type:"multiple", q:"What did the dove bring back to Noah?", clue:"The dove brought this back to Noah.", a:"Olive leaf", distractors:["Twig","Flower","Seed"] },

    // --- TOPIC: WOMEN ---
    { id:"w1", topic:"Women", difficulty:1, type:"multiple", q:"Who was the mother of Jesus?", clue:"She was the mother of Jesus.", a:"Mary", distractors:["Martha","Elizabeth","Salome"] },
    { id:"w2", topic:"Women", difficulty:2, type:"multiple", q:"Who was the Jewish queen who saved her people from Haman?", clue:"This Jewish queen saved her people from Haman.", a:"Esther", distractors:["Ruth","Deborah","Jezebel"] },
    { id:"w3", topic:"Women", difficulty:3, type:"multiple", q:"Who was the first female judge of Israel?", clue:"She was the first female judge of Israel.", a:"Deborah", distractors:["Miriam","Jael","Huldah"] },
    { id:"w4", topic:"Women", difficulty:4, type:"multiple", q:"Who laughed when told she would have a child in her old age?", clue:"She laughed when told she would have a child in her old age.", a:"Sarah", distractors:["Rebekah","Rachel","Leah"] },
    { id:"w5", topic:"Women", difficulty:5, type:"multiple", q:"Who was the seller of purple cloth who welcomed Paul?", clue:"She was the seller of purple cloth who welcomed Paul.", a:"Lydia", distractors:["Priscilla","Dorcas","Phoebe"] },
    { id:"w6", topic:"Women", difficulty:2, type:"multiple", q:"Who hid the Israelite spies in Jericho?", clue:"She hid the Israelite spies in Jericho.", a:"Rahab", distractors:["Ruth","Deborah","Miriam"] },
    { id:"w7", topic:"Women", difficulty:3, type:"multiple", q:"Who was the mother of Solomon?", clue:"She was the mother of Solomon.", a:"Bathsheba", distractors:["Michal","Abigail","Ahinoam"] },
    { id:"w8", topic:"Women", difficulty:1, type:"multiple", q:"Who was the mother of Isaac?", clue:"She was the mother of Isaac.", a:"Sarah", distractors:["Hagar","Rebekah","Keturah"] },
    { id:"w9", topic:"Women", difficulty:4, type:"multiple", q:"Who anointed Jesus' feet with perfume?", clue:"She anointed Jesus' feet with perfume.", a:"Mary of Bethany", distractors:["Mary Magdalene","The sinful woman","Martha"] },
    { id:"w10", topic:"Women", difficulty:2, type:"multiple", q:"Who was the mother of Jesus?", clue:"An angel told her she would bear the Son of God.", a:"Mary", distractors:["Elizabeth","Anna","Martha"] },

    // --- TOPIC: APOSTLES ---
    { id:"ap1", topic:"Apostles", difficulty:1, type:"multiple", q:"Which apostle denied Jesus three times?", clue:"This apostle denied Jesus three times.", a:"Peter", distractors:["Judas","John","Andrew"] },
    { id:"ap2", topic:"Apostles", difficulty:2, type:"multiple", q:"Which apostle was a tax collector?", clue:"This apostle was a tax collector.", a:"Matthew", distractors:["Luke","Thomas","Philip"] },
    { id:"ap3", topic:"Apostles", difficulty:3, type:"multiple", q:"Who was known as the 'Apostle to the Gentiles'?", clue:"He was known as the Apostle to the Gentiles.", a:"Paul", distractors:["Barnabas","Peter","James"] },
    { id:"ap4", topic:"Apostles", difficulty:4, type:"multiple", q:"Which apostle is often called 'Doubting'?", clue:"This apostle is often called Doubting.", a:"Thomas", distractors:["Bartholomew","Thaddaeus","Simon"] },
    { id:"ap5", topic:"Apostles", difficulty:5, type:"multiple", q:"Who was the first apostle to be martyred?", clue:"He was the first apostle to be martyred.", a:"James", distractors:["Stephen","Paul","Andrew"] },
    { id:"ap6", topic:"Apostles", difficulty:2, type:"multiple", q:"Which apostle was a fisherman with his brother Andrew?", clue:"This apostle was a fisherman with his brother Andrew.", a:"Peter", distractors:["James","John","Philip"] },
    { id:"ap7", topic:"Apostles", difficulty:4, type:"multiple", q:"Which apostle was formerly named Saul?", clue:"This apostle was formerly named Saul.", a:"Paul", distractors:["Simon","Matthew","Jude"] },
    { id:"ap8", topic:"Apostles", difficulty:3, type:"multiple", q:"Who was known as the beloved disciple?", clue:"He was known as the beloved disciple.", a:"John", distractors:["James","Peter","Andrew"] },
    { id:"ap9", topic:"Apostles", difficulty:1, type:"multiple", q:"Which apostle betrayed Jesus?", clue:"This apostle betrayed Jesus with a kiss.", a:"Judas", distractors:["Peter","Thomas","Philip"] },

    // --- TOPIC: KINGS ---
    { id:"k1", topic:"Kings", difficulty:1, type:"multiple", q:"Who was the second king of Israel?", clue:"He was the second king of Israel.", a:"David", distractors:["Saul","Solomon","Hezekiah"] },
    { id:"k2", topic:"Kings", difficulty:2, type:"multiple", q:"Which king built the first Temple in Jerusalem?", clue:"This king built the first Temple in Jerusalem.", a:"Solomon", distractors:["David","Josiah","Jehu"] },
    { id:"k3", topic:"Kings", difficulty:3, type:"multiple", q:"Who was the youngest king, starting his reign at age 7?", clue:"He was the youngest king, starting his reign at age 7.", a:"Joash", distractors:["Josiah","Manasseh","Uzziah"] },
    { id:"k4", topic:"Kings", difficulty:4, type:"multiple", q:"Which king of Babylon saw handwriting on the wall?", clue:"This king of Babylon saw handwriting on the wall.", a:"Belshazzar", distractors:["Nebuchadnezzar","Darius","Cyrus"] },
    { id:"k5", topic:"Kings", difficulty:5, type:"multiple", q:"Which king prayed and saw the sun's shadow go backward?", clue:"This king prayed and saw the sun's shadow go backward.", a:"Hezekiah", distractors:["Ahab","Zedekiah","Hoshea"] },
    { id:"k6", topic:"Kings", difficulty:1, type:"multiple", q:"Who was the first king of Israel?", clue:"He was the first king of Israel.", a:"Saul", distractors:["David","Solomon","Samuel"] },
    { id:"k7", topic:"Kings", difficulty:3, type:"multiple", q:"Which king had 700 wives and 300 concubines?", clue:"This king had 700 wives and 300 concubines.", a:"Solomon", distractors:["David","Rehoboam","Ahab"] },
    { id:"k8", topic:"Kings", difficulty:4, type:"multiple", q:"Which king was told his kingdom would be torn in two?", clue:"This king was told his kingdom would be torn in two.", a:"Solomon", distractors:["Rehoboam","Jeroboam","Hezekiah"] },
    { id:"k9", topic:"Kings", difficulty:2, type:"multiple", q:"Who was the king when Jesus was born?", clue:"He was the king when Jesus was born.", a:"Herod", distractors:["Caesar","Pilate","Augustus"] },
    { id:"k10", topic:"Kings", difficulty:5, type:"multiple", q:"Which king had leprosy and died in the Lord's house?", clue:"This king had leprosy and died in the Lord's house.", a:"Uzziah", distractors:["Jotham","Ahaz","Hezekiah"] },

    // --- TOPIC: PARABLES ---
    { id:"par1", topic:"Parables", difficulty:1, type:"multiple", q:"In the parable, what did the wise man build his house on?", clue:"In the parable, the wise man built his house on this.", a:"Rock", distractors:["Sand","Grass","Water"] },
    { id:"par2", topic:"Parables", difficulty:2, type:"multiple", q:"How many sheep did the shepherd leave to find the lost one?", clue:"The shepherd left this many sheep to find the lost one.", a:"99", distractors:["10","50","100"] },
    { id:"par3", topic:"Parables", difficulty:3, type:"multiple", q:"In the parable of the Sower, what happened to the seeds on the path?", clue:"In the parable of the Sower, this happened to the seeds on the path.", a:"Birds ate them", distractors:["They grew","Thorns choked them","Sun scorched them"] },
    { id:"par4", topic:"Parables", difficulty:4, type:"multiple", q:"The kingdom of heaven is like a grain of what tiny seed?", clue:"The kingdom of heaven is like a grain of this tiny seed.", a:"Mustard", distractors:["Wheat","Apple","Grape"] },
    { id:"par5", topic:"Parables", difficulty:5, type:"multiple", q:"In the parable of the Ten Virgins, what did the foolish ones forget?", clue:"In the parable of the Ten Virgins, the foolish ones forgot this.", a:"Oil", distractors:["Lamps","Wicks","Matches"] },
    { id:"par6", topic:"Parables", difficulty:2, type:"multiple", q:"In the Good Samaritan parable, who helped the injured man?", clue:"In the Good Samaritan parable, this person helped the injured man.", a:"Samaritan", distractors:["Priest","Levite","Israelite"] },
    { id:"par7", topic:"Parables", difficulty:3, type:"multiple", q:"What did the father do when the prodigal son returned?", clue:"The father did this when the prodigal son returned.", a:"Threw a feast", distractors:["Scolded him","Sent him away","Made him a servant"] },
    { id:"par8", topic:"Parables", difficulty:4, type:"multiple", q:"In the parable of the Talents, how many talents did the first servant receive?", clue:"In the parable of the Talents, the first servant received this many.", a:"Five", distractors:["One","Two","Ten"] },
    { id:"par9", topic:"Parables", difficulty:1, type:"multiple", q:"Where did the lost sheep go?", clue:"In the parable, the lost sheep went here.", a:"Away from the flock", distractors:["To another field","Into a pit","To the wolf"] },

    // --- TOPIC: PLACES ---
    { id:"p1", topic:"Places", difficulty:1, type:"multiple", q:"Where was Jesus born?", clue:"Jesus was born in this town.", a:"Bethlehem", distractors:["Nazareth","Jerusalem","Rome"] },
    { id:"p2", topic:"Places", difficulty:3, type:"multiple", q:"Where did Moses receive the Ten Commandments?", clue:"Moses received the Ten Commandments on this mountain.", a:"Mt. Sinai", distractors:["Mt. Nebo","Mt. Carmel","Mt. Ararat"] },
    { id:"p3", topic:"Places", difficulty:5, type:"multiple", q:"In what river was Jesus baptized?", clue:"Jesus was baptized in this river.", a:"Jordan River", distractors:["Nile","Euphrates","Tigris"] },
    { id:"p4", topic:"Places", difficulty:2, type:"multiple", q:"Where did Jesus grow up?", clue:"Jesus grew up in this town.", a:"Nazareth", distractors:["Bethlehem","Jerusalem","Capernaum"] },
    { id:"p5", topic:"Places", difficulty:3, type:"multiple", q:"Where was Jesus crucified?", clue:"Jesus was crucified at this place.", a:"Golgotha", distractors:["Gethsemane","Bethany","Jerusalem"] },
    { id:"p6", topic:"Places", difficulty:1, type:"multiple", q:"What city was the capital of Israel?", clue:"This city was the capital of Israel.", a:"Jerusalem", distractors:["Bethlehem","Samaria","Damascus"] },
    { id:"p7", topic:"Places", difficulty:4, type:"multiple", q:"Where did God give Moses the Ten Commandments?", clue:"God gave Moses the Ten Commandments on this mountain.", a:"Mount Sinai", distractors:["Mount Nebo","Mount Carmel","Mount Zion"] },
    { id:"p8", topic:"Places", difficulty:2, type:"multiple", q:"From what city did Paul travel on his missionary journeys?", clue:"Paul traveled from this city on his missionary journeys.", a:"Antioch", distractors:["Jerusalem","Damascus","Rome"] },
    { id:"p9", topic:"Places", difficulty:5, type:"multiple", q:"Where did the Israelites cross into the Promised Land?", clue:"The Israelites crossed into the Promised Land at this river.", a:"Jordan River", distractors:["Red Sea","Nile","Euphrates"] },
    { id:"p10", topic:"Places", difficulty:3, type:"multiple", q:"Where was Paul when he was converted?", clue:"Paul was on the road to this city when he was converted.", a:"Damascus", distractors:["Jerusalem","Antioch","Tarsus"] },

    // --- TOPIC: PROPHETS ---
    { id:"pr1", topic:"Prophets", difficulty:1, type:"multiple", q:"Who was the prophet in the belly of the great fish?", clue:"This prophet was in the belly of a great fish.", a:"Jonah", distractors:["Elijah","Elisha","Daniel"] },
    { id:"pr2", topic:"Prophets", difficulty:2, type:"multiple", q:"Who anointed David as king?", clue:"This prophet anointed David as king.", a:"Samuel", distractors:["Nathan","Gad","Elijah"] },
    { id:"pr3", topic:"Prophets", difficulty:3, type:"multiple", q:"Which prophet challenged the prophets of Baal on Mount Carmel?", clue:"This prophet challenged the prophets of Baal on Mount Carmel.", a:"Elijah", distractors:["Elisha","Nathan","Samuel"] },
    { id:"pr4", topic:"Prophets", difficulty:4, type:"multiple", q:"Who was the prophet who saw a valley of dry bones?", clue:"This prophet saw a valley of dry bones.", a:"Ezekiel", distractors:["Daniel","Isaiah","Jeremiah"] },
    { id:"pr5", topic:"Prophets", difficulty:2, type:"multiple", q:"Who was the prophet who confronted King David about Bathsheba?", clue:"This prophet confronted King David about Bathsheba.", a:"Nathan", distractors:["Gad","Samuel","Elijah"] },
    { id:"pr6", topic:"Prophets", difficulty:5, type:"multiple", q:"Which prophet was lowered into a cistern?", clue:"This prophet was lowered into a cistern.", a:"Jeremiah", distractors:["Ezekiel","Daniel","Isaiah"] },
    { id:"pr7", topic:"Prophets", difficulty:1, type:"multiple", q:"Who prophesied the birth of Jesus in Bethlehem?", clue:"This prophet prophesied the birth of Jesus in Bethlehem.", a:"Micah", distractors:["Isaiah","Jeremiah","Daniel"] },
    { id:"pr8", topic:"Prophets", difficulty:3, type:"multiple", q:"Who was the prophet taken to heaven in a whirlwind?", clue:"This prophet was taken to heaven in a whirlwind.", a:"Elijah", distractors:["Enoch","Elisha","Moses"] },

    // --- TOPIC: NUMBERS ---
    { id:"n1", topic:"Numbers", difficulty:1, type:"multiple", q:"How many days and nights did it rain during the flood?", clue:"It rained this many days and nights during the flood.", a:"40", distractors:["7","12","30"] },
    { id:"n2", topic:"Numbers", difficulty:2, type:"multiple", q:"How many plagues did God send on Egypt?", clue:"God sent this many plagues on Egypt.", a:"10", distractors:["7","12","9"] },
    { id:"n3", topic:"Numbers", difficulty:1, type:"multiple", q:"How many commandments did God give Moses?", clue:"God gave Moses this many commandments.", a:"10", distractors:["5","7","12"] },
    { id:"n4", topic:"Numbers", difficulty:3, type:"multiple", q:"How many disciples did Jesus have?", clue:"Jesus had this many disciples.", a:"12", distractors:["10","11","70"] },
    { id:"n5", topic:"Numbers", difficulty:2, type:"multiple", q:"How many days was Jesus in the tomb?", clue:"Jesus was in the tomb this many days.", a:"3", distractors:["1","2","7"] },
    { id:"n6", topic:"Numbers", difficulty:4, type:"multiple", q:"How many books are in the New Testament?", clue:"There are this many books in the New Testament.", a:"27", distractors:["39","66","22"] },
    { id:"n7", topic:"Numbers", difficulty:3, type:"multiple", q:"How many loaves did Jesus use to feed the 5,000?", clue:"Jesus used this many loaves to feed the 5,000.", a:"5", distractors:["2","7","12"] },
    { id:"n8", topic:"Numbers", difficulty:5, type:"multiple", q:"How many years did the Israelites wander in the wilderness?", clue:"The Israelites wandered in the wilderness this many years.", a:"40", distractors:["7","12","30"] },

    // --- TOPIC: MIRACLES ---
    { id:"m1", topic:"Miracles", difficulty:1, type:"multiple", q:"What did Jesus turn water into at Cana?", clue:"Jesus turned water into this at Cana.", a:"Wine", distractors:["Oil","Milk","Honey"] },
    { id:"m2", topic:"Miracles", difficulty:2, type:"multiple", q:"How many lepers did Jesus heal, and how many thanked Him?", clue:"Jesus healed 10 lepers; this many thanked Him.", a:"1", distractors:["10","5","2"] },
    { id:"m3", topic:"Miracles", difficulty:3, type:"multiple", q:"Who did Jesus raise from the dead after four days?", clue:"Jesus raised this person from the dead after four days.", a:"Lazarus", distractors:["Jairus' daughter","The widow's son","Tabitha"] },
    { id:"m4", topic:"Miracles", difficulty:2, type:"multiple", q:"On what did Jesus walk?", clue:"Jesus walked on this.", a:"Water", distractors:["Sand","Clouds","Fire"] },
    { id:"m5", topic:"Miracles", difficulty:4, type:"multiple", q:"Who did Peter raise from the dead?", clue:"Peter raised this person from the dead.", a:"Tabitha", distractors:["Lazarus","Eutychus","Dorcas"] },
    { id:"m6", topic:"Miracles", difficulty:1, type:"multiple", q:"What did Jesus multiply to feed the 5,000?", clue:"Jesus multiplied these to feed the 5,000.", a:"Loaves and fish", distractors:["Bread and wine","Manna","Grain"] },
    { id:"m7", topic:"Miracles", difficulty:5, type:"multiple", q:"Who did Paul raise from the dead after falling from a window?", clue:"Paul raised this person from the dead after a fall.", a:"Eutychus", distractors:["Tabitha","Lazarus","The slave"] },
    { id:"m8", topic:"Miracles", difficulty:3, type:"multiple", q:"What happened to the fig tree Jesus cursed?", clue:"This happened to the fig tree Jesus cursed.", a:"It withered", distractors:["It bore fruit","It fell","It burned"] },

    // --- TOPIC: JESUS ---
    { id:"j1", topic:"Jesus", difficulty:1, type:"multiple", q:"Who baptized Jesus?", clue:"This man baptized Jesus.", a:"John the Baptist", distractors:["Peter","James","Andrew"] },
    { id:"j2", topic:"Jesus", difficulty:2, type:"multiple", q:"What did Jesus say we are?", clue:"Jesus said we are the light of this.", a:"The world", distractors:["The church","The kingdom","Heaven"] },
    { id:"j3", topic:"Jesus", difficulty:3, type:"multiple", q:"At what age did Jesus first teach in the temple?", clue:"Jesus first taught in the temple at this age.", a:"12", distractors:["10","15","20"] },
    { id:"j4", topic:"Jesus", difficulty:2, type:"multiple", q:"What did Jesus say to do to our enemies?", clue:"Jesus said to do this to our enemies.", a:"Love them", distractors:["Avoid them","Fight them","Ignore them"] },
    { id:"j5", topic:"Jesus", difficulty:4, type:"multiple", q:"What title did Jesus use most for Himself?", clue:"Jesus used this title most for Himself.", a:"Son of Man", distractors:["King","Messiah","Lord"] },
    { id:"j6", topic:"Jesus", difficulty:1, type:"multiple", q:"Where was Jesus born?", clue:"Jesus was born in this town.", a:"Bethlehem", distractors:["Nazareth","Jerusalem","Capernaum"] },
    { id:"j7", topic:"Jesus", difficulty:5, type:"multiple", q:"To whom did Jesus say 'Today you will be with me in Paradise'?", clue:"Jesus said this to the penitent one next to Him.", a:"The thief on the cross", distractors:["Peter","John","Mary"] },
    { id:"j8", topic:"Jesus", difficulty:3, type:"multiple", q:"What did Jesus say was the greatest commandment?", clue:"Jesus said the greatest commandment was to do this.", a:"Love God and love your neighbor", distractors:["Keep the Sabbath","Honor your parents","Do not kill"] },

    // --- TOPIC: BOOKS ---
    { id:"b1", topic:"Books", difficulty:1, type:"multiple", q:"What is the first book of the Bible?", clue:"This is the first book of the Bible.", a:"Genesis", distractors:["Exodus","Matthew","Revelation"] },
    { id:"b2", topic:"Books", difficulty:2, type:"multiple", q:"Which book tells about the early church after Jesus ascended?", clue:"This book tells about the early church after Jesus ascended.", a:"Acts", distractors:["Romans","Galatians","Revelation"] },
    { id:"b3", topic:"Books", difficulty:3, type:"multiple", q:"Which book contains the Sermon on the Mount?", clue:"This Gospel contains the Sermon on the Mount.", a:"Matthew", distractors:["Mark","Luke","John"] },
    { id:"b4", topic:"Books", difficulty:2, type:"multiple", q:"What is the last book of the Bible?", clue:"This is the last book of the Bible.", a:"Revelation", distractors:["Jude","John","Malachi"] },
    { id:"b5", topic:"Books", difficulty:4, type:"multiple", q:"Which book records the building of the wall of Jerusalem?", clue:"This book records the building of the wall of Jerusalem.", a:"Nehemiah", distractors:["Ezra","Esther","Chronicles"] },
    { id:"b6", topic:"Books", difficulty:1, type:"multiple", q:"In which book do we find the Ten Commandments?", clue:"We find the Ten Commandments in this book.", a:"Exodus", distractors:["Genesis","Deuteronomy","Leviticus"] },
    { id:"b7", topic:"Books", difficulty:5, type:"multiple", q:"Which minor prophet spoke of the day of the Lord?", clue:"This minor prophet spoke of the day of the Lord.", a:"Joel", distractors:["Amos","Obadiah","Jonah"] },

    // --- SEQUENCE DATA (Testament Timeline) ---
    { id:"s1", topic:"Genesis", type:"sequence", q:"Order the first 4 days of Creation:", a:["Light", "Atmosphere", "Dry Land", "Sun & Moon"] },
    { id:"s2", topic:"Exodus", type:"sequence", q:"Order the Plagues of Egypt (First 4):", a:["Blood", "Frogs", "Gnats", "Flies"] },
    { id:"s3", topic:"Life of Jesus", type:"sequence", q:"Order the early life of Jesus:", a:["Birth", "Flight to Egypt", "Visit to Temple at 12", "Baptism"] },
    { id:"s4", topic:"Kings", type:"sequence", q:"Order these kings of Israel (first to last):", a:["Saul", "David", "Solomon", "Rehoboam"] },
    { id:"s5", topic:"Passion", type:"sequence", q:"Order the events of Holy Week:", a:["Triumphal Entry", "Last Supper", "Crucifixion", "Resurrection"] },
    { id:"s6", topic:"Genesis", type:"sequence", q:"Order the patriarchs:", a:["Abraham", "Isaac", "Jacob", "Joseph"] },
    { id:"s7", topic:"Paul", type:"sequence", q:"Order Paul's journey (first to last):", a:["Damascus conversion", "First missionary journey", "Prison epistles", "Rome"] },
    { id:"s8", topic:"Creation", type:"sequence", q:"Order the creation of living things:", a:["Sea creatures and birds", "Land animals", "Humans"] },
    { id:"s9", topic:"Plagues", type:"sequence", q:"Order plagues 5–8 of Egypt:", a:["Livestock die", "Boils", "Hail", "Locusts"] },
    { id:"s10", topic:"Gospels", type:"sequence", q:"Order the Gospels as they appear in the Bible:", a:["Matthew", "Mark", "Luke", "John"] },

    // --- TOPIC: MATCHING SETS ---
    { id:"match1", topic:"Tools", type:"match", q:"Match the person to their item:", a: { "Noah": "Ark", "David": "Sling", "Moses": "Staff", "Gideon": "Trumpet", "Peter": "Net" } },
    { id:"match2", topic:"Family", type:"match", q:"Match the Parents to the Son:", a: { "Abraham/Sarah": "Isaac", "Isaac/Rebekah": "Jacob", "Adam/Eve": "Cain", "Zechariah/Elizabeth": "John", "Elkanah/Hannah": "Samuel" } },
    { id:"match3", topic:"Kingdoms", type:"match", q:"Match the King to the Nation:", a: { "Solomon": "Israel", "Nebuchadnezzar": "Babylon", "Pharaoh": "Egypt", "Cyrus": "Persia", "Agrippa": "Rome" } },
    { id:"match4", topic:"Prophetic", type:"match", q:"Match the Prophet to the Miracle:", a: { "Moses": "Split Red Sea", "Elijah": "Fire from Heaven", "Elisha": "Floating Axe Head", "Joshua": "Sun Stood Still", "Daniel": "Stopped Lions" } },
    { id:"match5", topic:"Women", type:"match", q:"Match the woman to her son:", a: { "Sarah": "Isaac", "Rebekah": "Jacob", "Rachel": "Joseph", "Hannah": "Samuel", "Elizabeth": "John" } },
    { id:"match6", topic:"Places", type:"match", q:"Match the person to the place:", a: { "Moses": "Sinai", "Jesus": "Bethlehem", "Paul": "Damascus", "Abraham": "Ur", "David": "Jerusalem" } },
    { id:"match7", topic:"Objects", type:"match", q:"Match the object to its story:", a: { "Ark": "Noah", "Burning Bush": "Moses", "Lions' Den": "Daniel", "Furnace": "Shadrach", "Goliath's Sword": "David" } },
    { id:"match8", topic:"Apostles", type:"match", q:"Match the apostle to his role or trait:", a: { "Peter": "Rock", "John": "Beloved", "Matthew": "Tax collector", "Thomas": "Doubting", "Paul": "Apostle to Gentiles" } }
];