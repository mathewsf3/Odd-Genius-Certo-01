API KEY - 4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756 

API URL - https://api.football-data-api.com

Endpoints

League List
Get Leagues
GEThttps://api.football-data-api.com/league-list?key=4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756
Sample Response (Access the URL below)
https://api.football-data-api.com/league-list?key=4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756
Returns a JSON array of all leagues available in the API Database. Each season of a competition gives a unique ID.
Query Parameters
Name
Type
Description
chosen_leagues_only
string
If set to "true", the list will only return leagues that have been chosen by the user. ie ?key=xxxx&chosen_leagues_only=true
key
*
string
Your API Key
country
integer
ISO number of the country. Will filter the response to leagues from the selected country. Remove any leading 0s. If there are no data returned, it means there are no leagues we support in that country/nation.
200 Successfully retrieved all leagues.Hide ↑Copy
{
    "success": true,
    "data": [
        {
            "name": "USA MLS",
            "season": [
                {
                    "id": 1,
                    "year": 2016
                },
                {
                    "id": 16,
                    "year": 2015
                },
                {
                    "id": 1076,
                    "year": 2018
                }
            ]
        }
    ]
}
Queries and Parameters
Variable Name
Description
name
Name of the league
league_name
Name of the league without country
country
Country name
season > id
ID of the season
season > year
Year of the season

Country List
Get Countries
GEThttps://api.football-data-api.com/country-list?key=4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756
Sample Response (Access the URL below)
https://api.football-data-api.com/country-list?key=4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756
Returns a JSON array of Countries and its ISO numbers. Often called to get the ISO number for filtering the results of other endpoints.
Query Parameters
Name
Type
Description
key
*
string
Your API Key
200 Successfully retrieved all leagues.Hide ↑Copy
{
    "success": true,
    "data": [
        {
            "id": 4,
            "name": "Afghanistan"
        },
        {
            "id": 901,
            "name": "Africa"
        },
        {
            "id": 248,
            "name": "Åland Islands"
        },
        {
            "id": 8,
            "name": "Albania"
        }
    ]
}
Queries and Parameters
Variable Name
Description
id
ID of the country
name
Name of the country
country
Country name
season > id
ID of the season
season > year
Year of the season

Today's Matches (Matches by day)
Get a list of matches by date

Get a list of today's matches with or without stats
GEThttps://api.football-data-api.com/todays-matches?key=4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756
Sample Response (Access the URL below)
https://api.football-data-api.com/todays-matches?key=4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756
You must choose the leagues in your settings for the matches to show up here.
Returns a maximum of 200 matches per page. Pagination is enabled by default. Add &page=2 to begin paginating.
Query Parameters
Name
Type
Description
timezone
string
Timezone. ie &timezone=Europe/London. Uses TZ timezone name : https://en.wikipedia.org/wiki/List_of_tz_database_time_zones. Defaults to Etc/UTC if not specified.
date
string
Date format = YYYY-MM-DD. ie &date=2020-07-30. If not entered, defaults to current day in UTC timezone.
key
*
string
Your API key.
200 Successfully retrieved all leagues.Hide ↑Copy
{
    "success": true,
    "pager": {
        "current_page": 1,
        "max_page": 1,
        "results_per_page": 200,
        "total_results": 2
    },
    "data": [
        {
            "id": 579362,
            "homeID": 155,
            "awayID": 93,
            "season": "2019/2020",
            "status": "incomplete",
            "roundID": 50055,
            "game_week": 37,
            "revised_game_week": -1,
            "homeGoals": "[]",
            "awayGoals": "[]",
            "homeGoalCount": 0,
            "awayGoalCount": 0,
            "totalGoalCount": 0,
            "team_a_corners": -1,
            "team_b_corners": -1,
            "totalCornerCount": 0,
            "team_a_offsides": 0,
            "team_b_offsides": 0,
            "team_a_yellow_cards": 0,
            "team_b_yellow_cards": 0,
            "team_a_red_cards": 0,
            "team_b_red_cards": 0,
            "team_a_shotsOnTarget": -1,
            "team_b_shotsOnTarget": -1,
            "team_a_shotsOffTarget": -1,
            "team_b_shotsOffTarget": -1,
            "team_a_shots": -2,
            "team_b_shots": -2,
            "team_a_fouls": -1,
            "team_b_fouls": -1,
            "team_a_possession": -1,
            "team_b_possession": -1,
            "refereeID": -1,
            "coach_a_ID": -1,
            "coach_b_ID": -1,
            "stadium_name": "",
            "stadium_location": "",
            "team_a_cards_num": 0,
            "team_b_cards_num": 0,
            "odds_ft_1": 8.75,
            "odds_ft_x": 5.8,
            "odds_ft_2": 1.33
        }
    ]
}
Variable Name
Description
id
ID of the Match.
homeID
Home team id.
awayID
Away team id.
season
Season year of the league.
status
Status of the league.
roundID
Round ID.
game_week
Game week number.
revised_game_week
Revised game week -1 is default and means no revision.
homeGoals
Goal timings for Home team.
awayGoals
Goal timings for Home team.
homeGoalCount
How many goals scored by Home team.
awayGoalCount
How many goals scored by Away team.
totalGoalCount
How many goals scored in the match.
team_a_corners
Corners for Home team, -1 is default.
team_b_corners
Corners for Away team, -1 is default.
totalCornerCount
How many corners in the match.
team_a_offsides
Offsides for Home team.
team_b_offsides
Offsides for Away team.
team_a_yellow_cards
Yellow cards booked by Home team.
team_b_yellow_cards
Yellow cards booked by Away team.
team_a_red_cards
Red cards booked by Home team.
team_b_red_cards
Red cards booked by Away team.
team_a_shotsOnTarget
Shots on target for Home team, -1 is default.
team_b_shotsOnTarget
Shots on target for Away team, -1 is default.
team_a_shotsOffTarget
Shots off target for Home team, -1 is default.
team_b_shotsOffTarget
Shots off target for Away team, -1 is default.
team_a_shots
Total shots for Home team, -2 is default.
team_b_shots
Total shots for Away team, -2 is default.
team_a_fouls
Fouls for Home team, -1 is default.
team_b_fouls
Fouls for Away team, -1 is default.
team_a_possession
Possession for Home team, -1 is default.
team_b_possession
Possession for Away team, -1 is default.
refereeID
ID of the referee.
coach_a_ID
ID of the coach for Home team.
coach_b_ID
ID of the coach for Away team.
stadium_name
Name of the stadium.
stadium_location
Location of the stadium.
team_a_cards_num
Total cards booked by Home team.
team_b_cards_num
Total cards booked by Away team.
odds_ft_1
Odds for Home team win at fulltime.
odds_ft_X
Odds for draw at fulltime.
odds_ft_2
Odds for Away team win at fulltime.

League Stats
Get Season Stats and Teams
GEThttps://api.football-data-api.com/league-season?key=4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756&season_id=X
Sample Response (Access the URL below)
https://api.football-data-api.com/league-season?key=4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756&season_id=2012
This endpoint responds with the League season's stats, and an array of Teams that have participated in the season. The teams contain all stats relevant to them.
Query Parameters
Name
Type
Description
max_time
integer
UNIX Timestamp. Set this number if you would like the API to return the stats of the league and the teams up to a certain time. For example, if I enter &max_time=1537984169, then the API will respond with stats as of September 26th, 2018.
key
*
string
Your API Key
season_id
*
integer
ID of the league season that you would like to retrieve.
200 Successfully retrieved all leagues.Hide ↑Copy
{
    "success": true,
    "data": [
        {
            "id": "161",
            "division": "1",
            "name": "Premier League",
            "shortHand": "premier-league",
            "country": "England",
            "type": "Domestic League",
            "iso": "gb-eng",
            "continent": "eu",
            "image": "competitions/england-premier-league.png",
            "image_thumb": "competitions/england-premier-league_thumb.png",
            "url": "/england/premier-league/2017-2018/overview",
            "parent_url": "/england/premier-league",
            "countryURL": "/england",
            "tie_break": "goal-difference",
            "domestic_scale": "1",
            "international_scale": "2",
            "clubs": "[...Array...]",
            "clubNum": 20,
            "year": "20172018",
            "season": "2017/2018",
            "starting_year": "2017",
            "ending_year": "2018",
            "no_home_away": false,
            "seasonClean": "2017/18"
        }
    ]
}
Queries and Parameters
Variable Name
Description
id
ID of the season
name
Name of the league
english_name
Name of the league with diacritics and accents removed
country
Name of the country
domestic_scale
How important this league is within their own country. Often used to rank leagues in a feed.
international_scale
How important this country's leagues are globally. Often used to rank leagues in a feed.
status
Status of the season
format
Format of the league
division
Division of the League
no_home_away
Set to 1 if this league has no home or away distinction
starting_year
YStarting year of the season. ie 17-18 season starting year is 2017.
ending_year
Ending year of the season. ie 17-18 season ending year is 2018.
women
Set to 1 or true if this league is a women's football league
continent
Continent of which the league is in
image
URL of the League image.
clubNum
Number of clubs in the league
season
Full description of the season
goalTimingDisabled
Set to 1 if the goal timings are not available for all of this league
totalMatches
Total # of matches in this league season
matchesCompleted
Number of matches completed this season
canceledMatchesNum
Number of canceled matches this season
game_week
Current game week of the league
total_game_week
Total number of game weeks
round
ID of the current season round. This corresponds to the round of the tables
progress
Progress of the season in %
total_goals
Total number of goals in this season
home_teams_goals
Number of goals scored by the home team
home_teams_conceded
Number of goals conceded by the home team
away_teams_goals
Number of goals scored by the away team
away_teams_conceded
Number of goals conceded by the away team
seasonAVG_overall
Average number of total goals per match
seasonAVG_home
Average number of goals scored by home teams per match
seasonAVG_away
Average number of goals scored by away teams per match
btts_matches
Number of matches that ended in BTTS
seasonBTTSPercentage
% of matches that ended in BTTS
seasonCSPercentage
% of matches that ended with a Clean sheet for either team
home_teams_clean_sheets
Number of clean sheets kept by the home team
away_teams_clean_sheets
Number of clean sheets kept by the away team
home_teams_failed_to_score
Number of failed to score by the home team
away_teams_failed_to_score
Number of failed to score by the away team
riskNum
FootyStats Prediction Risk
homeAttackAdvantagePercentage
Home advantage in terms of Attacking. How much more the percentage of goals the home teams score as opposed to away teams.
homeDefenceAdvantagePercentage
Home advantage in terms of Defence. How much less the percentage of goals the home teams concede as opposed to away teams.
homeOverallAdvantage
Overall advantage between Attacking and Defensive advantage
cornersAVG_overall
Average corners per match in the league
cornersAVG_home
Average corners per match of the home team
cornersAVG_away
Average corners per match of the away team
cornersTotal_overall
Total number of corners that happened in this season
cornersTotal_home
Total number of corners that the home teams earned
cornersTotal_away
otal number of corners that the away teams earned
cardsAVG_overall
Average cards per match in this season
cardsAVG_home
verage cards conceded per match for the home team
cardsAVG_away
Average cards conceded per match for the way team
cardsTotal_overall
Total number of cards that was dealt in this season
cardsTotal_home
Total number of cards that was dealt to the home team this season
cardsTotal_away
Total number of cards that was dealt to the away team this season
foulsTotal_overall
Number of fouls that happened this season
foulsTotal_home
Number of fouls the home team had conceded this season
foulsTotal_away
Number of fouls the away team had conceded this season
foulsAVG_overall
Average number of fouls per match
foulsAVG_home
Average number of fouls per match for the home team
foulsAVG_away
Average number fouls per match for the away team
shotsTotal_overall
Total number of shots this season
shotsTotal_home
Total number of shots by the home team this season
shotsTotal_away
Total number of shots by the away team this season
shotsAVG_overall
Average shots per match this season
shotsAVG_home
Average shots per match by the home team this season
shotsAVG_away
Average shots per match by the away team this season
offsidesTotal_overall
Total number of Offsides this season
offsidesTotal_home
Total number of Offsides by the home team this season
offsidesTotal_away
Total number of Offsides by the away team this season
offsidesAVG_overall
Average number of offsides per match
offsidesAVG_home
Average number of offsides per match for the home team
offsidesAVG_away
Average number of offsides per match for the away team
offsidesOver05_overall - offsidesOver65_overall
Number of matches ending with Over 0.5 - 6.5 offsides this season
over05OffsidesPercentage_overall - over65OffsidesPercentage_overall
Percentage of Over 0.5 - 6.5 offside matches this season
seasonOver05Percentage_overall - seasonOver55Percentage_overall
Percentage of Over 0.5 - 5.5 match goals that happened this season
seasonUnder05Percentage_overall - seasonUnder55Percentage_overall
Percentage of Under 0.5 - 5.5 match goals that happened this season
cornersRecorded_matches
Number of matches with corners recorded
cardsRecorded_matches
Number of matches with cards recorded
offsidesRecorded_matches
Number of matches with offsides recorded
over65Corners_overall - over145Corners_overall
Number of matches that ended with over 6.5 - 14.5 corners
over65CornersPercentage_overall - over145CornersPercentage_overall
Percentage of matches that ended with Over 6.5 - 14.5 corners
over05Cards_overall - over75Cards_overall
Number of matches that ended with over 0.5 - 7.5 cards
over05CardsPercentage_overall - over75CardsPercentage_overall
Percentage of matches that ended with over 0.5 - 7.5 cards
homeWins
Number of home team wins
draws
Number of draws
awayWins
Number of away team wins
homeWinPercentage
Home team win %
drawPercentage
Draw %
awayWinPercentage
Away team win %
shotsRecorded_matches
Number of matches with shots recorded
foulsRecorded_matches
Number of matches with fouls recorded
failed_to_score_total
Number of times teams faileds to score
clean_sheets_total
Number of timess team kept a clean sheet
round_format
Format of the current round of the season. 0 = League, 1 = Group Stage, 2 = Knock outs
goals_min_0_to_10 - goals_min_76_to_90
Number of goals within the given period
player_count
Number of players that have participated in this league
over05_fhg_num - over35_fhg_num
Number of matches with Over 0.5 - 3.5 first half goals during this season
over05_fhg_percentage - over35_fhg_percentage
Percentage of matches with Over 0.5 - 3.5 first half goals
over05_2hg_num - over35_2hg_num
Number of matches with Over 0.5 - 3.5 2nd half goals during this season
over05_2hg_percentage - over35_2hg_percentage
Percentage of matches with Over 0.5 - 3.5 2nd half goals
goalTimingsRecorded_num
Number of matches where goal timings have been recorded
iso
Country ISO of the league
seasonGoals_home
Goal timings for all goals scored by the home team. Array
seasonConceded_home
Goal timings for all goals conceded by the home team. Array
seasonGoals_away
Goal timings for all goals scored by the away team.
seasonConceded_away
Goal timings for all goals conceded by the away team
footystats_url
URL of the league on footystats


League Matches
Get Matches
GEThttps://api.football-data-api.com/league-matches?key=4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756&season_id=1
Sample Response (Access the URL below)
https://api.football-data-api.com/league-matches?key=4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756&season_id=2012
This endpoint responds with the full match schedule of the selected league id. Response will be a JSON Array containing each match details. Defaults to 300 matches per page. You can set &max_per_page=X (ie &max_per_page=500) to raise the amount of matches returned per page.
Query Parameters
Name
Type
Description
page
integer
ie "&page=2". Pagination. Each page by default shows up to 500 matches. If you want to see the next 500 matches, add &page=2 or &page=3, etc to paginate.
max_per_page
integer
ie "&max_per_page=500". This raises the number of matches returned per page. Max 1000.
max_time
integer
UNIX timestamp. Set this number if you would like the API to return the stats of the league and the teams up to a certain time. For example, if I enter &max_time=1537984169, then the API will respond with stats as of Sept 26, 2018.
key
*
string
Your API Key
season_id
*
integer
ID of the league season that you would like to retrieve.
200 Successfully retrieved all leagues.Hide ↑Copy
{
    "success": true,
    "data": [
        {
            "id": 49347,
            "homeID": 1002,
            "awayID": 1003,
            "season": "2017",
            "status": "complete",
            "roundID": "245",
            "game_week": "1",
            "revised_game_week": null,
            "homeGoals": [
                "13",
                "85",
                "90+2"
            ],
            "awayGoals": [
                "63",
                "64"
            ],
            "homeGoalCount": 3,
            "awayGoalCount": 2,
            "totalGoalCount": 5,
            "team_a_corners": 3,
            "team_b_corners": 5,
            "team_a_offsides": 3,
            "team_b_offsides": 1,
            "team_a_cards": [
                69,
                31,
                18
            ],
            "team_b_cards": [
                56,
                25
            ],
            "team_a_yellow_cards": 3,
            "team_b_yellow_cards": 2,
            "team_a_red_cards": 0,
            "team_b_red_cards": 0,
            "team_a_shotsOnTarget": 9,
            "team_b_shotsOnTarget": 10,
            "team_a_shotsOffTarget": 8,
            "team_b_shotsOffTarget": 5,
            "team_a_shots": 17,
            "team_b_shots": 15,
            "team_a_fouls": 18,
            "team_b_fouls": 15,
            "team_a_possession": 34,
            "team_b_possession": 66,
            "refereeID": 3193,
            "coach_a_ID": 1155,
            "coach_b_ID": 2322,
            "stadiumID": "0c0f0ce895c01f821348565e24606ab5",
            "stadium_name": "Nissan Stadium (Yokohama)",
            "stadium_location": "3302-5 Kozukue, Kohoku-ku, Yokohama",
            "team_a_cards_num": 3,
            "team_b_cards_num": 2,
            "odds_ft_1": 3.63,
            "odds_ft_x": 3.52,
            "odds_ft_2": 2.15,
            "odds_ft_over05": 0,
            "odds_ft_over15": 0,
            "odds_ft_over25": 0,
            "odds_ft_over35": 0,
            "odds_ft_over45": 0,
            "odds_ft_under05": 0,
            "odds_ft_under15": 0,
            "odds_ft_under25": 0,
            "odds_ft_under35": 0,
            "odds_ft_under45": 0,
            "odds_btts_yes": 0,
            "odds_btts_no": 0,
            "id_bet365": "",
            "odds_team_a_cs_yes": 0,
            "odds_team_a_cs_no": 0,
            "odds_team_b_cs_yes": 0,
            "odds_team_b_cs_no": 0,
            "id_ft_1": "",
            "id_ft_x": "",
            "id_ft_2": "",
            "id_ft_over05": "",
            "id_ft_over15": "",
            "id_ft_over25": "",
            "id_ft_over35": "",
            "id_ft_over45": "",
            "id_btts_yes": "",
            "id_btts_no": "",
            "id_team_a_cs_yes": "",
            "id_team_b_cs_yes": "",
            "id_team_a_cs_no": "",
            "id_team_b_cs_no": "",
            "events": [],
            "overallGoalCount": 5,
            "half_time": {
                "team_a": 1,
                "team_b": 0
            },
            "ht_goals_team_a": 1,
            "ht_goals_team_b": 0,
            "HTGoalCount": 1,
            "btts": true,
            "over05": true,
            "over15": true,
            "over25": true,
            "over35": true,
            "over45": true,
            "over55": false,
            "over65Corners": true,
            "over75Corners": true,
            "over85Corners": false,
            "over95Corners": false,
            "over105Corners": false,
            "over115Corners": false,
            "over125Corners": false,
            "over135Corners": false,
            "over145Corners": false,
            "date": null,
            "date_unix": 1487993400,
            "winningTeam": 1002,
            "no_home_away": 0,
            "home_team_goal_timings": "13,85,90'2",
            "away_team_goal_timings": "63,64"
        }
    ]
}
Queries and Parameters
You can test this API call by using the key "example" and loading the matches from the English Premier League 2018/2019 season (ID: 1625).

Variable Name
Description
id
ID of the match.
homeID
ID of the home team.
awayID
ID of the away team.
season
Season of the league.
status
Status of the match ('complete', 'suspended', 'canceled', 'incomplete').
roundID
Round ID of the match within the season.
game_week
Game week of the match within the season.
homeGoals
Goal timings for home team goals. Array
awayGoals
Goal timings for away team goals. Array
homeGoalCount
Number of home team goals.
awayGoalCount
Number of away team goals.
totalGoalCount
Number of total match goals.
team_a_corners
Number of Home Team Corners.
team_b_corners
Number of Away Team Corners.
team_a_offsides
Number of Offsides - Home Team.
team_b_offsides
Number of Offsides - Away Team.
team_a_yellow_cards
Number of yellow cards - Home Team.
team_b_yellow_cards
Number of yellow cards - Away Team.
team_a_red_cards
Number of Red Cards - Home Team.
team_b_red_cards
Number of Red Cards - Away Team.
team_a_shotsOnTarget
Number of Shots On Target - Home Team.
team_b_shotsOnTarget
Number of Shots On Target - Away Team.
team_a_shotsOffTarget
Number of Shots Off Target - Home Team.
team_b_shotsOffTarget
Number of Shots Off Target - Away Team.
team_a_shots
Number of Shots - Home Team.
team_b_shots
Number of Shots - Away Team.
team_a_fouls
Number of Fouls - Home Team.
team_b_fouls
Number of Fouls - Away Team.
team_a_possession
Possession of the Home Team.
team_b_possession
Possession of the Away Team.
refereeID
ID of the referee for this match.
coach_a_ID
ID of the coach for home team.
coach_b_ID
ID of the coach for away team.
stadium_name
Name of the stadium.
stadium_location
Location of the stadium.
team_a_cards_num
Number of cards for home team.
team_b_cards_num
Number of cards for away team.
odds_ft_1
Odds for Home Team Win at FT.
odds_ft_x
Odds for Draw at FT.
odds_ft_2
Odds for Away Team Win at FT.
odds_ft_over05 - odds_ft_over45
Odds for Over 0.5 - 4.5 match goals.
odds_ft_under05 - odds_ft_under45
Odds for Under 0.5 - 4.5 match goals.
odds_btts_yes / no
Odds for BTTS Yes / No.
odds_team_a_cs_yes / a_cs_no / b_cs_yes / b_cs_no
Odds for Clean Sheet Yes / No for Home and Away team.
overallGoalCount
Total number of goals in the match.
ht_goals_team_a
Number of home team goals by HT.
ht_goals_team_b
Number of away team goals by HT.
HTGoalCount
Total number of goals by HT.
date_unix
UNIX timestamp of the match kick off.
winningTeam
ID of the team that won. -1 if draw.
no_home_away
set to 1 if there is no home or away distinction for this match.
btts_potential
Pre-Match Stat for BTTS for both teams. Average between both teams.
o15_potential - o45_potential
Pre-Match Stat for Over 1.5 - 4.5 for both teams. Average between both teams.
o05HT_potential - o15HT_potential
Pre-Match Stat for Over 0.5 - 1.5 for both teams by HT. Average between both teams.
corners_potential
Pre-Match average corners for both teams.
offsides_potential
Pre-Match average offsides for both teams.
cards_potential
re-Match average cards for both teams.
avg_potential
Pre-Match average total goals per match for both teams.
corners_o85_potential - corners_o105_potential
Pre-Match Over X Corners for both teams.
u15_potential - u45_potential
Pre-Match Stat for Under 1.5 - 4.5 for both teams. Average between both teams
home_ppg
Points per game for home team. Current
away_ppg
Points per game for away team. Current
pre_match_home_ppg
Pre-Match Points Per Game for Home Team.
pre_match_away_ppg
Pre-Match Points Per Game for Away Team.
competition_id
Season ID of the league.
over05 - over55
Set to true if the match ended with Over X goals.
btts
Set to true if match ended with BTTS.


League Teams
Stats for all teams that participated in a season of a league. For example, the 20 teams in 2019/20 Premier League season.

Get Teams in a League Season
GEThttps://api.football-data-api.com/league-teams?key=4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756&season_id=*&include=stats
Sample Response (Access the URL below)
https://api.football-data-api.com/league-teams?key=4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756&season_id=2012&include=stats
Returns the data of each team as a JSON array.
Add &include=stats to the request to get the stats of each team !
Query Parameters
Name
Type
Description
page
integer
50 teams are returned per page. By default, the initial page loaded is page 1. View following pages by appending &page=PAGE_NUMBER_HERE .
include
string
appending &include=stats to your query will allow you to bring in stats. In the future, we will be working to include more data. The included stats will be from the requested season, for each team.
max_time
string
UNIX Timestamp. Set this number if you would like the API to return the stats of the league and the teams up to a certain time. For example, if I enter &max_time=1537984169, then the API will respond with stats as of September 26th, 2019.
key
*
string
Your API Key
season_id
*
integer
ID of the league season that you would like to retrieve.
200 Successfully retrieved all leagues.Hide ↑Copy
{
    "success": true,
    "pager": {
        "page": 1,
        "per_page": 50,
        "total_results": 20
    },
    "data": [
        {
            "id": 59,
            "original_id": 59,
            "name": "Arsenal FC",
            "cleanName": "Arsenal",
            "english_name": "Arsenal FC",
            "shortHand": "arsenal-fc",
            "country": "England",
            "continent": "",
            "image": "https://cdn.footystats.org/img/teams/england-arsenal-fc.png",
            "flag_element": null,
            "season": "2018/2019",
            "seasonClean": null,
            "url": "https://footystats.org/clubs/england/arsenal-fc",
            "stadium_name": "",
            "stadium_address": "",
            "table_position": 5,
            "performance_rank": 5,
            "risk": 87,
            "season_format": "Domestic League",
            "competition_id": 1625,
            "founded": "1886",
            "full_name": "Arsenal FC",
            "alt_names": [],
            "official_sites": [],
            "stats": {
                "previous_seasons": [],
                "suspended_matches": 0,
                "homeAttackAdvantage": 29,
                "homeDefenceAdvantage": 0,
                "homeOverallAdvantage": 0,
                "seasonGoals_overall": 56,
                "seasonGoals_home": [
                    "13",
                    "64",
                    "45+1",
                    "71",
                    "59",
                    "81",
                    "84",
                    "9",
                    "7",
                    "9",
                    "21",
                    "18",
                    "90+6",
                    "50",
                    "13",
                    "8",
                    "42",
                    "45",
                    "54",
                    "57",
                    "90",
                    "90+5",
                    "27",
                    "33",
                    "46",
                    "78",
                    "33",
                    "37",
                    "67",
                    "81",
                    "21",
                    "32",
                    "44",
                    "5",
                    "24",
                    "33"
                ],
                "seasonGoals_away": [
                    "58",
                    "85",
                    "21",
                    "32",
                    "58",
                    "29",
                    "57",
                    "60",
                    "66",
                    "69",
                    "63",
                    "12",
                    "63",
                    "87",
                    "68",
                    "20",
                    "86",
                    "43",
                    "86",
                    "16"
                ],
                "seasonConceded_overall": 48,
                "seasonConceded_home": [
                    "43",
                    "10",
                    "40",
                    "20",
                    "60",
                    "32",
                    "52",
                    "76",
                    "8",
                    "71",
                    "36",
                    "80",
                    "2",
                    "15",
                    "40",
                    "83",
                    "87",
                    "83",
                    "1",
                    "45+4",
                    "84",
                    "20",
                    "43",
                    "66"
                ],
                "seasonConceded_away": [
                    "41",
                    "49",
                    "58",
                    "53",
                    "81",
                    "45",
                    "30",
                    "68",
                    "75",
                    "21",
                    "45+2",
                    "38",
                    "35",
                    "54",
                    "28",
                    "84",
                    "45+2",
                    "51",
                    "90+1",
                    "75",
                    "90+5",
                    "19",
                    "81",
                    "27"
                ],
                "seasonGoalsTotal_overall": 104,
                "seasonGoalsTotal_home": 60,
                "seasonGoalsTotal_away": 44,
                "seasonScoredNum_overall": 56,
                "seasonScoredNum_home": 36,
                "seasonScoredNum_away": 20,
                "seasonConcededNum_overall": 48,
                "seasonConcededNum_home": 24,
                "seasonConcededNum_away": 24,
                "seasonGoalsMin_overall": 33,
                "seasonGoalsMin_home": 28,
                "seasonGoalsMin_away": 39,
                "seasonScoredMin_overall": 61,
                "seasonScoredMin_home": 48,
                "seasonScoredMin_away": 86,
                "seasonConcededMin_overall": 71,
                "seasonConcededMin_home": 71,
                "seasonConcededMin_away": 71,
                "seasonGoalDifference_overall": 8,
                "seasonGoalDifference_home": 12,
                "seasonGoalDifference_away": -4,
                "seasonWinsNum_overall": 14,
                "seasonWinsNum_home": 10,
                "seasonWinsNum_away": 4,
                "seasonDrawsNum_overall": 14,
                "seasonDrawsNum_home": 6,
                "seasonDrawsNum_away": 8,
                "seasonLossesNum_overall": 10,
                "seasonLossesNum_home": 3,
                "seasonLossesNum_away": 7,
                "seasonMatchesPlayed_overall": 38,
                "seasonMatchesPlayed_away": 19,
                "seasonMatchesPlayed_home": 19,
                "seasonHighestScored_home": 4,
                "seasonHighestConceded_home": 3,
                "seasonHighestScored_away": 3,
                "seasonHighestConceded_away": 3,
                "seasonCS_overall": 10,
                "seasonCS_home": 5,
                "seasonCS_away": 5,
                "seasonCSPercentage_overall": 26,
                "seasonCSPercentage_home": 26,
                "seasonCSPercentage_away": 26,
                "seasonCSHT_overall": 18,
                "seasonCSHT_home": 9,
                "seasonCSHT_away": 9,
                "seasonCSPercentageHT_overall": 47,
                "seasonCSPercentageHT_home": 47,
                "seasonCSPercentageHT_away": 47,
                "seasonFTS_overall": 7,
                "seasonFTSPercentage_overall": 18,
                "seasonFTSPercentage_home": 5,
                "seasonFTSPercentage_away": 32,
                "seasonFTS_home": 1,
                "seasonFTS_away": 6,
                "seasonFTSHT_overall": 18,
                "seasonFTSPercentageHT_overall": 47,
                "seasonFTSPercentageHT_home": 26,
                "seasonFTSPercentageHT_away": 68,
                "seasonFTSHT_home": 5,
                "seasonFTSHT_away": 13,
                "seasonBTTS_overall": 23,
                "seasonBTTS_home": 13,
                "seasonBTTS_away": 10,
                "seasonBTTSPercentage_overall": 61,
                "seasonBTTSPercentage_home": 68,
                "seasonBTTSPercentage_away": 53,
                "seasonBTTSHT_overall": 9,
                "seasonBTTSHT_home": 7,
                "seasonBTTSHT_away": 2,
                "seasonBTTSPercentageHT_overall": 24,
                "seasonBTTSPercentageHT_home": 37,
                "seasonBTTSPercentageHT_away": 11,
                "seasonPPG_overall": 1.47,
                "seasonRecentPPG": null,
                "seasonPPG_home": 1.89,
                "seasonPPG_away": 1.05,
                "currentFormHome": null,
                "currentFormAway": null,
                "seasonAVG_overall": 2.74,
                "seasonAVG_home": 3.16,
                "seasonAVG_away": 2.32,
                "seasonScoredAVG_overall": 1.47,
                "seasonScoredAVG_home": 1.89,
                "seasonScoredAVG_away": 1.05,
                "seasonConcededAVG_overall": 1.26,
                "seasonConcededAVG_home": 1.26,
                "seasonConcededAVG_away": 1.26,
                "winPercentage_overall": 37,
                "winPercentage_home": 53,
                "winPercentage_away": 21,
                "drawPercentage_overall": 37,
                "drawPercentage_home": 32,
                "drawPercentage_away": 42,
                "losePercentage_overall": 26,
                "losePercentage_home": 16,
                "losePercentage_away": 37,
                "leadingAtHT_overall": 14,
                "leadingAtHT_home": 10,
                "leadingAtHT_away": 4,
                "leadingAtHTPercentage_overall": 37,
                "leadingAtHTPercentage_home": 53,
                "leadingAtHTPercentage_away": 21,
                "drawingAtHT_home": 5,
                "drawingAtHT_away": 6,
                "drawingAtHT_overall": 11,
                "drawingAtHTPercentage_home": 26,
                "drawingAtHTPercentage_away": 32,
                "drawingAtHTPercentage_overall": 29,
                "trailingAtHT_home": 4,
                "trailingAtHT_away": 9,
                "trailingAtHT_overall": 13,
                "trailingAtHTPercentage_home": 21,
                "trailingAtHTPercentage_away": 47,
                "trailingAtHTPercentage_overall": 34,
                "HTPoints_overall": 53,
                "HTPoints_home": 35,
                "HTPoints_away": 18,
                "HTPPG_overall": 1.39,
                "HTPPG_home": 1.84,
                "HTPPG_away": 0.95,
                "scoredAVGHT_overall": 0.74,
                "scoredAVGHT_home": 1.11,
                "scoredAVGHT_away": 0.37,
                "concededAVGHT_overall": 0.66,
                "concededAVGHT_home": 0.74,
                "concededAVGHT_away": 0.58,
                "AVGHT_overall": 1.39,
                "AVGHT_home": 1.84,
                "AVGHT_away": 0.95,
                "scoredGoalsHT_overall": 28,
                "scoredGoalsHT_home": 21,
                "scoredGoalsHT_away": 7,
                "concededGoalsHT_overall": 25,
                "concededGoalsHT_home": 14,
                "concededGoalsHT_away": 11,
                "GoalsHT_overall": 53,
                "GoalsHT_home": 35,
                "GoalsHT_away": 18,
                "GoalDifferenceHT_overall": 3,
                "GoalDifferenceHT_home": 7,
                "GoalDifferenceHT_away": -4,
                "seasonOver55Num_overall": 0,
                "seasonOver45Num_overall": 3,
                "seasonOver35Num_overall": 13,
                "seasonOver25Num_overall": 21,
                "seasonOver15Num_overall": 31,
                "seasonOver05Num_overall": 36,
                "seasonOver55Percentage_overall": 0,
                "seasonOver45Percentage_overall": 8,
                "seasonOver35Percentage_overall": 34,
                "seasonOver25Percentage_overall": 55,
                "seasonOver15Percentage_overall": 82,
                "seasonOver05Percentage_overall": 95,
                "seasonUnder55Percentage_overall": 100,
                "seasonUnder45Percentage_overall": 92,
                "seasonUnder35Percentage_overall": 66,
                "seasonUnder25Percentage_overall": 45,
                "seasonUnder15Percentage_overall": 18,
                "seasonUnder05Percentage_overall": 5,
                "seasonUnder55Num_overall": 38,
                "seasonUnder45Num_overall": 35,
                "seasonUnder35Num_overall": 25,
                "seasonUnder25Num_overall": 17,
                "seasonUnder15Num_overall": 7,
                "seasonUnder05Num_overall": 2,
                "seasonOver55Percentage_home": 0,
                "seasonOver45Percentage_home": 16,
                "seasonOver35Percentage_home": 42,
                "seasonOver25Percentage_home": 68,
                "seasonOver15Percentage_home": 89,
                "seasonOver05Percentage_home": 100,
                "seasonOver55Num_home": 0,
                "seasonOver45Num_home": 3,
                "seasonOver35Num_home": 8,
                "seasonOver25Num_home": 13,
                "seasonOver15Num_home": 17,
                "seasonOver05Num_home": 19,
                "seasonUnder55Percentage_home": 100,
                "seasonUnder45Percentage_home": 84,
                "seasonUnder35Percentage_home": 58,
                "seasonUnder25Percentage_home": 32,
                "seasonUnder15Percentage_home": 11,
                "seasonUnder05Percentage_home": 0,
                "seasonUnder55Num_home": 19,
                "seasonUnder45Num_home": 16,
                "seasonUnder35Num_home": 11,
                "seasonUnder25Num_home": 6,
                "seasonUnder15Num_home": 2,
                "seasonUnder05Num_home": 0,
                "seasonOver55Percentage_away": 0,
                "seasonOver45Percentage_away": 0,
                "seasonOver35Percentage_away": 26,
                "seasonOver25Percentage_away": 42,
                "seasonOver15Percentage_away": 74,
                "seasonOver05Percentage_away": 89,
                "seasonOver55Num_away": 0,
                "seasonOver45Num_away": 0,
                "seasonOver35Num_away": 5,
                "seasonOver25Num_away": 8,
                "seasonOver15Num_away": 14,
                "seasonOver05Num_away": 17,
                "seasonUnder55Percentage_away": 100,
                "seasonUnder45Percentage_away": 100,
                "seasonUnder35Percentage_away": 74,
                "seasonUnder25Percentage_away": 58,
                "seasonUnder15Percentage_away": 26,
                "seasonUnder05Percentage_away": 11,
                "seasonUnder55Num_away": 19,
                "seasonUnder45Num_away": 19,
                "seasonUnder35Num_away": 14,
                "seasonUnder25Num_away": 11,
                "seasonUnder15Num_away": 5,
                "seasonUnder05Num_away": 2,
                "seasonOver25NumHT_overall": 7,
                "seasonOver15NumHT_overall": 13,
                "seasonOver05NumHT_overall": 31,
                "seasonOver25PercentageHT_overall": 18,
                "seasonOver15PercentageHT_overall": 34,
                "seasonOver05PercentageHT_overall": 82,
                "seasonOver25PercentageHT_home": 32,
                "seasonOver15PercentageHT_home": 53,
                "seasonOver05PercentageHT_home": 89,
                "seasonOver25NumHT_home": 6,
                "seasonOver15NumHT_home": 10,
                "seasonOver05NumHT_home": 17,
                "seasonOver25PercentageHT_away": 5,
                "seasonOver15PercentageHT_away": 16,
                "seasonOver05PercentageHT_away": 74,
                "seasonOver25NumHT_away": 1,
                "seasonOver15NumHT_away": 3,
                "seasonOver05NumHT_away": 14,
                "cornersRecorded_matches_overall": 38,
                "cornersRecorded_matches_home": 19,
                "cornersRecorded_matches_away": 19,
                "over65Corners_overall": 34,
                "over75Corners_overall": 32,
                "over85Corners_overall": 28,
                "over95Corners_overall": 24,
                "over105Corners_overall": 22,
                "over115Corners_overall": 18,
                "over125Corners_overall": 16,
                "over135Corners_overall": 14,
                "over145Corners_overall": 13,
                "over65CornersPercentage_overall": 89,
                "over75CornersPercentage_overall": 84,
                "over85CornersPercentage_overall": 74,
                "over95CornersPercentage_overall": 63,
                "over105CornersPercentage_overall": 57,
                "over115CornersPercentage_overall": 47,
                "over125CornersPercentage_overall": 42,
                "over135CornersPercentage_overall": 37,
                "over145CornersPercentage_overall": 34,
                "over65Corners_home": 16,
                "over75Corners_home": 16,
                "over85Corners_home": 15,
                "over95Corners_home": 13,
                "over105Corners_home": 13,
                "over115Corners_home": 11,
                "over125Corners_home": 10,
                "over135Corners_home": 8,
                "over145Corners_home": 7,
                "over65CornersPercentage_home": 84,
                "over75CornersPercentage_home": 84,
                "over85CornersPercentage_home": 79,
                "over95CornersPercentage_home": 68,
                "over105CornersPercentage_home": 68,
                "over115CornersPercentage_home": 57,
                "over125CornersPercentage_home": 53,
                "over135CornersPercentage_home": 42,
                "over145CornersPercentage_home": 37,
                "over65Corners_away": 18,
                "over75Corners_away": 16,
                "over85Corners_away": 13,
                "over95Corners_away": 11,
                "over105Corners_away": 9,
                "over115Corners_away": 7,
                "over125Corners_away": 6,
                "over135Corners_away": 6,
                "over145Corners_away": 6,
                "over65CornersPercentage_away": 95,
                "over75CornersPercentage_away": 84,
                "over85CornersPercentage_away": 68,
                "over95CornersPercentage_away": 57,
                "over105CornersPercentage_away": 47,
                "over115CornersPercentage_away": 37,
                "over125CornersPercentage_away": 32,
                "over135CornersPercentage_away": 32,
                "over145CornersPercentage_away": 32,
                "over25CornersFor_overall": 33,
                "over35CornersFor_overall": 29,
                "over45CornersFor_overall": 23,
                "over55CornersFor_overall": 19,
                "over65CornersFor_overall": 14,
                "over75CornersFor_overall": 11,
                "over85CornersFor_overall": 10,
                "over25CornersForPercentage_overall": 87,
                "over35CornersForPercentage_overall": 76,
                "over45CornersForPercentage_overall": 61,
                "over55CornersForPercentage_overall": 50,
                "over65CornersForPercentage_overall": 37,
                "over75CornersForPercentage_overall": 28,
                "over85CornersForPercentage_overall": 26,
                "over25CornersFor_home": 16,
                "over35CornersFor_home": 15,
                "over45CornersFor_home": 13,
                "over55CornersFor_home": 12,
                "over65CornersFor_home": 8,
                "over75CornersFor_home": 8,
                "over85CornersFor_home": 7,
                "over25CornersForPercentage_home": 84,
                "over35CornersForPercentage_home": 79,
                "over45CornersForPercentage_home": 68,
                "over55CornersForPercentage_home": 63,
                "over65CornersForPercentage_home": 42,
                "over75CornersForPercentage_home": 42,
                "over85CornersForPercentage_home": 37,
                "over25CornersFor_away": 17,
                "over35CornersFor_away": 14,
                "over45CornersFor_away": 10,
                "over55CornersFor_away": 7,
                "over65CornersFor_away": 6,
                "over75CornersFor_away": 3,
                "over85CornersFor_away": 3,
                "over25CornersForPercentage_away": 89,
                "over35CornersForPercentage_away": 74,
                "over45CornersForPercentage_away": 53,
                "over55CornersForPercentage_away": 37,
                "over65CornersForPercentage_away": 32,
                "over75CornersForPercentage_away": 16,
                "over85CornersForPercentage_away": 16,
                "over25CornersAgainst_overall": 35,
                "over35CornersAgainst_overall": 31,
                "over45CornersAgainst_overall": 27,
                "over55CornersAgainst_overall": 19,
                "over65CornersAgainst_overall": 15,
                "over75CornersAgainst_overall": 10,
                "over85CornersAgainst_overall": 5,
                "over25CornersAgainstPercentage_overall": 92,
                "over35CornersAgainstPercentage_overall": 82,
                "over45CornersAgainstPercentage_overall": 71,
                "over55CornersAgainstPercentage_overall": 50,
                "over65CornersAgainstPercentage_overall": 39,
                "over75CornersAgainstPercentage_overall": 26,
                "over85CornersAgainstPercentage_overall": 13,
                "over25CornersAgainst_home": 17,
                "over35CornersAgainst_home": 14,
                "over45CornersAgainst_home": 12,
                "over55CornersAgainst_home": 9,
                "over65CornersAgainst_home": 7,
                "over75CornersAgainst_home": 5,
                "over85CornersAgainst_home": 3,
                "over25CornersAgainstPercentage_home": 89,
                "over35CornersAgainstPercentage_home": 74,
                "over45CornersAgainstPercentage_home": 63,
                "over55CornersAgainstPercentage_home": 47,
                "over65CornersAgainstPercentage_home": 37,
                "over75CornersAgainstPercentage_home": 26,
                "over85CornersAgainstPercentage_home": 16,
                "over25CornersAgainst_away": 18,
                "over35CornersAgainst_away": 17,
                "over45CornersAgainst_away": 15,
                "over55CornersAgainst_away": 10,
                "over65CornersAgainst_away": 8,
                "over75CornersAgainst_away": 5,
                "over85CornersAgainst_away": 2,
                "over25CornersAgainstPercentage_away": 95,
                "over35CornersAgainstPercentage_away": 89,
                "over45CornersAgainstPercentage_away": 79,
                "over55CornersAgainstPercentage_away": 53,
                "over65CornersAgainstPercentage_away": 42,
                "over75CornersAgainstPercentage_away": 26,
                "over85CornersAgainstPercentage_away": 11,
                "over05Cards_overall": 38,
                "over15Cards_overall": 38,
                "over25Cards_overall": 31,
                "over35Cards_overall": 24,
                "over45Cards_overall": 17,
                "over55Cards_overall": 13,
                "over65Cards_overall": 8,
                "over75Cards_overall": 0,
                "over85Cards_overall": 0,
                "over05CardsPercentage_overall": 100,
                "over15CardsPercentage_overall": 100,
                "over25CardsPercentage_overall": 82,
                "over35CardsPercentage_overall": 63,
                "over45CardsPercentage_overall": 45,
                "over55CardsPercentage_overall": 34,
                "over65CardsPercentage_overall": 21,
                "over75CardsPercentage_overall": 0,
                "over85CardsPercentage_overall": 0,
                "over05Cards_home": 19,
                "over15Cards_home": 19,
                "over25Cards_home": 15,
                "over35Cards_home": 10,
                "over45Cards_home": 7,
                "over55Cards_home": 5,
                "over65Cards_home": 4,
                "over75Cards_home": 0,
                "over85Cards_home": 0,
                "over05CardsPercentage_home": 100,
                "over15CardsPercentage_home": 100,
                "over25CardsPercentage_home": 79,
                "over35CardsPercentage_home": 53,
                "over45CardsPercentage_home": 37,
                "over55CardsPercentage_home": 26,
                "over65CardsPercentage_home": 21,
                "over75CardsPercentage_home": 0,
                "over85CardsPercentage_home": 0,
                "over05Cards_away": 19,
                "over15Cards_away": 19,
                "over25Cards_away": 16,
                "over35Cards_away": 14,
                "over45Cards_away": 10,
                "over55Cards_away": 8,
                "over65Cards_away": 4,
                "over75Cards_away": 0,
                "over85Cards_away": 0,
                "over05CardsPercentage_away": 100,
                "over15CardsPercentage_away": 100,
                "over25CardsPercentage_away": 84,
                "over35CardsPercentage_away": 74,
                "over45CardsPercentage_away": 53,
                "over55CardsPercentage_away": 42,
                "over65CardsPercentage_away": 21,
                "over75CardsPercentage_away": 0,
                "over85CardsPercentage_away": 0,
                "over05CardsFor_overall": 35,
                "over15CardsFor_overall": 26,
                "over25CardsFor_overall": 20,
                "over35CardsFor_overall": 8,
                "over45CardsFor_overall": 4,
                "over55CardsFor_overall": 2,
                "over65CardsFor_overall": 1,
                "over05CardsForPercentage_overall": 92,
                "over15CardsForPercentage_overall": 68,
                "over25CardsForPercentage_overall": 53,
                "over35CardsForPercentage_overall": 21,
                "over45CardsForPercentage_overall": 11,
                "over55CardsForPercentage_overall": 5,
                "over65CardsForPercentage_overall": 3,
                "over05CardsFor_home": 17,
                "over15CardsFor_home": 12,
                "over25CardsFor_home": 8,
                "over35CardsFor_home": 3,
                "over45CardsFor_home": 3,
                "over55CardsFor_home": 2,
                "over65CardsFor_home": 1,
                "over05CardsForPercentage_home": 89,
                "over15CardsForPercentage_home": 63,
                "over25CardsForPercentage_home": 42,
                "over35CardsForPercentage_home": 16,
                "over45CardsForPercentage_home": 16,
                "over55CardsForPercentage_home": 11,
                "over65CardsForPercentage_home": 5,
                "over05CardsFor_away": 18,
                "over15CardsFor_away": 14,
                "over25CardsFor_away": 12,
                "over35CardsFor_away": 5,
                "over45CardsFor_away": 1,
                "over55CardsFor_away": 0,
                "over65CardsFor_away": 0,
                "over05CardsForPercentage_away": 95,
                "over15CardsForPercentage_away": 74,
                "over25CardsForPercentage_away": 63,
                "over35CardsForPercentage_away": 26,
                "over45CardsForPercentage_away": 5,
                "over55CardsForPercentage_away": 0,
                "over65CardsForPercentage_away": 0,
                "over05CardsAgainst_overall": 34,
                "over15CardsAgainst_overall": 25,
                "over25CardsAgainst_overall": 11,
                "over35CardsAgainst_overall": 9,
                "over45CardsAgainst_overall": 2,
                "over55CardsAgainst_overall": 0,
                "over65CardsAgainst_overall": 0,
                "over05CardsAgainstPercentage_overall": 89,
                "over15CardsAgainstPercentage_overall": 66,
                "over25CardsAgainstPercentage_overall": 28,
                "over35CardsAgainstPercentage_overall": 24,
                "over45CardsAgainstPercentage_overall": 5,
                "over55CardsAgainstPercentage_overall": 0,
                "over65CardsAgainstPercentage_overall": 0,
                "over05CardsAgainst_home": 15,
                "over15CardsAgainst_home": 11,
                "over25CardsAgainst_home": 6,
                "over35CardsAgainst_home": 5,
                "over45CardsAgainst_home": 1,
                "over55CardsAgainst_home": 0,
                "over65CardsAgainst_home": 0,
                "over05CardsAgainstPercentage_home": 79,
                "over15CardsAgainstPercentage_home": 57,
                "over25CardsAgainstPercentage_home": 32,
                "over35CardsAgainstPercentage_home": 26,
                "over45CardsAgainstPercentage_home": 5,
                "over55CardsAgainstPercentage_home": 0,
                "over65CardsAgainstPercentage_home": 0,
                "over05CardsAgainst_away": 19,
                "over15CardsAgainst_away": 14,
                "over25CardsAgainst_away": 5,
                "over35CardsAgainst_away": 4,
                "over45CardsAgainst_away": 1,
                "over55CardsAgainst_away": 0,
                "over65CardsAgainst_away": 0,
                "over05CardsAgainstPercentage_away": 100,
                "over15CardsAgainstPercentage_away": 74,
                "over25CardsAgainstPercentage_away": 26,
                "over35CardsAgainstPercentage_away": 21,
                "over45CardsAgainstPercentage_away": 5,
                "over55CardsAgainstPercentage_away": 0,
                "over65CardsAgainstPercentage_away": 0,
                "leaguePosition_overall": 8,
                "leaguePosition_home": 7,
                "leaguePosition_away": 10,
                "firstGoalScored_home": 12,
                "firstGoalScored_away": 7,
                "firstGoalScored_overall": 19,
                "firstGoalScoredPercentage_home": 63,
                "firstGoalScoredPercentage_away": 37,
                "firstGoalScoredPercentage_overall": 50,
                "cornersTotal_overall": 231,
                "cornersTotal_home": 128,
                "cornersTotal_away": 103,
                "cardsTotal_overall": 96,
                "cardsTotal_home": 46,
                "cardsTotal_away": 50,
                "cornersTotalAVG_overall": 12.11,
                "cornersTotalAVG_home": 12.42,
                "cornersTotalAVG_away": 11.79,
                "cornersAVG_overall": 6.08,
                "cornersAVG_home": 6.74,
                "cornersAVG_away": 5.42,
                "cornersAgainst_overall": 229,
                "cornersAgainst_home": 108,
                "cornersAgainst_away": 121,
                "cornersAgainstAVG_overall": 6.03,
                "cornersAgainstAVG_home": 5.68,
                "cornersAgainstAVG_away": 6.37,
                "cornersHighest_overall": 14,
                "cornersLowest_overall": 1,
                "cardsHighest_overall": 7,
                "cardsLowest_overall": 0,
                "cardsAVG_overall": 2.53,
                "cardsAVG_home": 2.42,
                "cardsAVG_away": 2.63,
                "shotsTotal_overall": 430,
                "shotsTotal_home": 235,
                "shotsTotal_away": 195,
                "shotsAVG_overall": 11.32,
                "shotsAVG_home": 12.37,
                "shotsAVG_away": 10.26,
                "shotsOnTargetTotal_overall": 189,
                "shotsOnTargetTotal_home": 108,
                "shotsOnTargetTotal_away": 81,
                "shotsOffTargetTotal_overall": 241,
                "shotsOffTargetTotal_home": 127,
                "shotsOffTargetTotal_away": 114,
                "shotsOnTargetAVG_overall": 4.97,
                "shotsOnTargetAVG_home": 5.68,
                "shotsOnTargetAVG_away": 4.26,
                "shotsOffTargetAVG_overall": 6.34,
                "shotsOffTargetAVG_home": 6.68,
                "shotsOffTargetAVG_away": 6,
                "possessionAVG_overall": 54,
                "possessionAVG_home": 53,
                "possessionAVG_away": 55,
                "foulsAVG_overall": 11.05,
                "foulsAVG_home": 11.63,
                "foulsAVG_away": 10.47,
                "foulsTotal_overall": 420,
                "foulsTotal_home": 221,
                "foulsTotal_away": 199,
                "offsidesTotal_overall": 125,
                "offsidesTotal_home": 70,
                "offsidesTotal_away": 55,
                "offsidesTeamTotal_overall": 73,
                "offsidesTeamTotal_home": 44,
                "offsidesTeamTotal_away": 29,
                "offsidesRecorded_matches_overall": 38,
                "offsidesRecorded_matches_home": 19,
                "offsidesRecorded_matches_away": 19,
                "offsidesAVG_overall": 3.29,
                "offsidesAVG_home": 3.68,
                "offsidesAVG_away": 2.89,
                "offsidesTeamAVG_overall": 1.92,
                "offsidesTeamAVG_home": 2.32,
                "offsidesTeamAVG_away": 1.53,
                "offsidesOver05_overall": 36,
                "offsidesOver15_overall": 30,
                "offsidesOver25_overall": 24,
                "offsidesOver35_overall": 17,
                "offsidesOver45_overall": 9,
                "offsidesOver55_overall": 5,
                "offsidesOver65_overall": 2,
                "over05OffsidesPercentage_overall": 95,
                "over15OffsidesPercentage_overall": 79,
                "over25OffsidesPercentage_overall": 63,
                "over35OffsidesPercentage_overall": 45,
                "over45OffsidesPercentage_overall": 24,
                "over55OffsidesPercentage_overall": 13,
                "over65OffsidesPercentage_overall": 5,
                "offsidesOver05_home": 17,
                "offsidesOver15_home": 17,
                "offsidesOver25_home": 14,
                "offsidesOver35_home": 10,
                "offsidesOver45_home": 5,
                "offsidesOver55_home": 3,
                "offsidesOver65_home": 2,
                "over05OffsidesPercentage_home": 89,
                "over15OffsidesPercentage_home": 89,
                "over25OffsidesPercentage_home": 74,
                "over35OffsidesPercentage_home": 53,
                "over45OffsidesPercentage_home": 26,
                "over55OffsidesPercentage_home": 16,
                "over65OffsidesPercentage_home": 11,
                "offsidesOver05_away": 19,
                "offsidesOver15_away": 13,
                "offsidesOver25_away": 10,
                "offsidesOver35_away": 7,
                "offsidesOver45_away": 4,
                "offsidesOver55_away": 2,
                "offsidesOver65_away": 0,
                "over05OffsidesPercentage_away": 100,
                "over15OffsidesPercentage_away": 68,
                "over25OffsidesPercentage_away": 53,
                "over35OffsidesPercentage_away": 37,
                "over45OffsidesPercentage_away": 21,
                "over55OffsidesPercentage_away": 11,
                "over65OffsidesPercentage_away": 0,
                "offsidesTeamOver05_overall": 29,
                "offsidesTeamOver15_overall": 19,
                "offsidesTeamOver25_overall": 11,
                "offsidesTeamOver35_overall": 8,
                "offsidesTeamOver45_overall": 4,
                "offsidesTeamOver55_overall": 1,
                "offsidesTeamOver65_overall": 1,
                "over05OffsidesTeamPercentage_overall": 76,
                "over15OffsidesTeamPercentage_overall": 50,
                "over25OffsidesTeamPercentage_overall": 28,
                "over35OffsidesTeamPercentage_overall": 21,
                "over45OffsidesTeamPercentage_overall": 11,
                "over55OffsidesTeamPercentage_overall": 3,
                "over65OffsidesTeamPercentage_overall": 3,
                "offsidesTeamOver05_home": 16,
                "offsidesTeamOver15_home": 13,
                "offsidesTeamOver25_home": 6,
                "offsidesTeamOver35_home": 4,
                "offsidesTeamOver45_home": 3,
                "offsidesTeamOver55_home": 1,
                "offsidesTeamOver65_home": 1,
                "over05OffsidesTeamPercentage_home": 84,
                "over15OffsidesTeamPercentage_home": 68,
                "over25OffsidesTeamPercentage_home": 32,
                "over35OffsidesTeamPercentage_home": 21,
                "over45OffsidesTeamPercentage_home": 16,
                "over55OffsidesTeamPercentage_home": 5,
                "over65OffsidesTeamPercentage_home": 5,
                "offsidesTeamOver05_away": 13,
                "offsidesTeamOver15_away": 6,
                "offsidesTeamOver25_away": 5,
                "offsidesTeamOver35_away": 4,
                "offsidesTeamOver45_away": 1,
                "offsidesTeamOver55_away": 0,
                "offsidesTeamOver65_away": 0,
                "over05OffsidesTeamPercentage_away": 68,
                "over15OffsidesTeamPercentage_away": 32,
                "over25OffsidesTeamPercentage_away": 26,
                "over35OffsidesTeamPercentage_away": 21,
                "over45OffsidesTeamPercentage_away": 5,
                "over55OffsidesTeamPercentage_away": 0,
                "over65OffsidesTeamPercentage_away": 0,
                "scoredBothHalves_overall": 8,
                "scoredBothHalves_home": 5,
                "scoredBothHalves_away": 3,
                "scoredBothHalvesPercentage_overall": 21,
                "scoredBothHalvesPercentage_home": 26,
                "scoredBothHalvesPercentage_away": 16,
                "seasonMatchesPlayedGoalTimingRecorded_overall": 38,
                "seasonMatchesPlayedGoalTimingRecorded_home": 19,
                "seasonMatchesPlayedGoalTimingRecorded_away": 19,
                "BTTS_and_win_overall": 6,
                "BTTS_and_win_home": 5,
                "BTTS_and_win_away": 1,
                "BTTS_and_win_percentage_overall": 16,
                "BTTS_and_win_percentage_home": 26,
                "BTTS_and_win_percentage_away": 5,
                "BTTS_and_draw_overall": 12,
                "BTTS_and_draw_home": 6,
                "BTTS_and_draw_away": 6,
                "BTTS_and_draw_percentage_overall": 32,
                "BTTS_and_draw_percentage_home": 32,
                "BTTS_and_draw_percentage_away": 32,
                "BTTS_and_lose_overall": 5,
                "BTTS_and_lose_home": 2,
                "BTTS_and_lose_away": 3,
                "BTTS_and_lose_percentage_overall": 13,
                "BTTS_and_lose_percentage_home": 11,
                "BTTS_and_lose_percentage_away": 16,
                "AVG_2hg_overall": 1.34,
                "AVG_2hg_home": 1.32,
                "AVG_2hg_away": 1.37,
                "scored_2hg_avg_overall": 0.74,
                "scored_2hg_avg_home": 0.79,
                "scored_2hg_avg_away": 0.68,
                "conceded_2hg_avg_overall": 0.61,
                "conceded_2hg_avg_home": 0.53,
                "conceded_2hg_avg_away": 0.68,
                "total_2hg_overall": 51,
                "total_2hg_home": 25,
                "total_2hg_away": 26,
                "conceded_2hg_overall": 23,
                "conceded_2hg_home": 10,
                "conceded_2hg_away": 13,
                "scored_2hg_overall": 28,
                "scored_2hg_home": 15,
                "scored_2hg_away": 13,
                "over25_2hg_num_overall": 6,
                "over15_2hg_num_overall": 13,
                "over05_2hg_num_overall": 30,
                "over25_2hg_percentage_overall": 16,
                "over15_2hg_percentage_overall": 34,
                "over05_2hg_percentage_overall": 79,
                "over25_2hg_num_home": 2,
                "over15_2hg_num_home": 6,
                "over05_2hg_num_home": 15,
                "over25_2hg_percentage_home": 11,
                "over15_2hg_percentage_home": 32,
                "over05_2hg_percentage_home": 79,
                "over25_2hg_num_away": 4,
                "over15_2hg_num_away": 7,
                "over05_2hg_num_away": 15,
                "over25_2hg_percentage_away": 21,
                "over15_2hg_percentage_away": 37,
                "over05_2hg_percentage_away": 79,
                "points_2hg_overall": 55,
                "points_2hg_home": 27,
                "points_2hg_away": 28,
                "ppg_2hg_overall": 1.45,
                "ppg_2hg_home": 1.42,
                "ppg_2hg_away": 1.47,
                "ppg_2hg_processed_overall": "",
                "ppg_2hg_processed_home": "",
                "ppg_2hg_processed_away": "",
                "wins_2hg_overall": 15,
                "wins_2hg_home": 7,
                "wins_2hg_away": 8,
                "wins_2hg_percentage_overall": 39,
                "wins_2hg_percentage_home": 37,
                "wins_2hg_percentage_away": 42,
                "draws_2hg_overall": 10,
                "draws_2hg_home": 6,
                "draws_2hg_away": 4,
                "draws_2hg_percentage_overall": 26,
                "draws_2hg_percentage_home": 32,
                "draws_2hg_percentage_away": 21,
                "losses_2hg_overall": 13,
                "losses_2hg_home": 6,
                "losses_2hg_away": 7,
                "losses_2hg_percentage_overall": 34,
                "losses_2hg_percentage_home": 32,
                "losses_2hg_percentage_away": 37,
                "gd_2hg_overall": 5,
                "gd_2hg_home": 5,
                "gd_2hg_away": 0,
                "gd_text_2hg_overall": "",
                "gd_text_2hg_home": "",
                "gd_text_2hg_away": "",
                "btts_2hg_overall": 6,
                "btts_2hg_home": 3,
                "btts_2hg_away": 3,
                "btts_2hg_percentage_overall": 16,
                "btts_2hg_percentage_home": 16,
                "btts_2hg_percentage_away": 16,
                "btts_fhg_overall": 9,
                "btts_fhg_home": 7,
                "btts_fhg_away": 2,
                "btts_fhg_percentage_overall": 24,
                "btts_fhg_percentage_home": 37,
                "btts_fhg_percentage_away": 11,
                "cs_2hg_overall": 21,
                "cs_2hg_home": 10,
                "cs_2hg_away": 11,
                "cs_2hg_percentage_overall": 55,
                "cs_2hg_percentage_home": 53,
                "cs_2hg_percentage_away": 57,
                "fts_2hg_overall": 19,
                "fts_2hg_home": 10,
                "fts_2hg_away": 9,
                "fts_2hg_percentage_overall": 50,
                "fts_2hg_percentage_home": 53,
                "fts_2hg_percentage_away": 47,
                "BTTS_both_halves_overall": 1,
                "BTTS_both_halves_home": 1,
                "BTTS_both_halves_away": 0,
                "BTTS_both_halves_percentage_overall": 3,
                "BTTS_both_halves_percentage_home": 5,
                "BTTS_both_halves_percentage_away": 0,
                "formRun_ht_overall": "",
                "formRun_ht_home": "",
                "formRun_ht_away": "",
                "formRun_2hg_overall": "",
                "formRun_2hg_home": "",
                "formRun_2hg_away": "",
                "average_attendance_overall": 36482,
                "average_attendance_home": 47589,
                "average_attendance_away": 25376,
                "cornerTimingRecorded_matches_overall": 37,
                "cornerTimingRecorded_matches_home": 18,
                "cornerTimingRecorded_matches_away": 19,
                "corners_fh_overall": 211,
                "corners_2h_overall": 232,
                "corners_fh_home": 107,
                "corners_2h_home": 112,
                "corners_fh_away": 104,
                "corners_2h_away": 120,
                "corners_fh_avg_overall": 5.7,
                "corners_2h_avg_overall": 6.27,
                "corners_fh_avg_home": 5.94,
                "corners_2h_avg_home": 6.22,
                "corners_fh_avg_away": 5.47,
                "corners_2h_avg_away": 6.32,
                "corners_fh_over4_overall": 21,
                "corners_2h_over4_overall": 22,
                "corners_fh_over4_home": 13,
                "corners_2h_over4_home": 10,
                "corners_fh_over4_away": 8,
                "corners_2h_over4_away": 12,
                "corners_fh_over4_percentage_overall": 56,
                "corners_2h_over4_percentage_overall": 59,
                "corners_fh_over4_percentage_home": 72,
                "corners_2h_over4_percentage_home": 56,
                "corners_fh_over4_percentage_away": 42,
                "corners_2h_over4_percentage_away": 63,
                "corners_fh_over5_overall": 17,
                "corners_2h_over5_overall": 20,
                "corners_fh_over5_home": 9,
                "corners_2h_over5_home": 10,
                "corners_fh_over5_away": 8,
                "corners_2h_over5_away": 10,
                "corners_fh_over5_percentage_overall": 46,
                "corners_2h_over5_percentage_overall": 54,
                "corners_fh_over5_percentage_home": 50,
                "corners_2h_over5_percentage_home": 56,
                "corners_fh_over5_percentage_away": 42,
                "corners_2h_over5_percentage_away": 53,
                "corners_fh_over6_overall": 14,
                "corners_2h_over6_overall": 17,
                "corners_fh_over6_home": 7,
                "corners_2h_over6_home": 8,
                "corners_fh_over6_away": 7,
                "corners_2h_over6_away": 9,
                "corners_fh_over6_percentage_overall": 38,
                "corners_2h_over6_percentage_overall": 46,
                "corners_fh_over6_percentage_home": 39,
                "corners_2h_over6_percentage_home": 44,
                "corners_fh_over6_percentage_away": 37,
                "corners_2h_over6_percentage_away": 47,
                "attack_num_recoded_matches_overall": 38,
                "dangerous_attacks_num_overall": 1907,
                "attacks_num_overall": 3876,
                "dangerous_attacks_avg_overall": 50.18,
                "dangerous_attacks_avg_home": 52.68,
                "dangerous_attacks_avg_away": 47.68,
                "attacks_avg_overall": 102,
                "attacks_avg_home": 98.58,
                "attacks_avg_away": 105.42,
                "xg_for_avg_overall": 1.43,
                "xg_for_avg_home": 1.56,
                "xg_for_avg_away": 1.3,
                "xg_against_avg_overall": 1.75,
                "xg_against_avg_home": 1.79,
                "xg_against_avg_away": 1.72,
                "additional_info": {
                    "attack_num_recoded_matches_home": 19,
                    "attack_num_recoded_matches_away": 19,
                    "dangerous_attacks_num_home": 1001,
                    "dangerous_attacks_num_away": 906,
                    "attacks_num_home": 1873,
                    "attacks_num_away": 2003,
                    "xg_for_overall": 54.4,
                    "xg_for_home": 29.7,
                    "xg_for_away": 24.7,
                    "xg_against_overall": 66.68,
                    "xg_against_home": 34.04,
                    "xg_against_away": 32.64,
                    "seasonScoredOver35Num_overall": 2,
                    "seasonScoredOver25Num_overall": 6,
                    "seasonScoredOver15Num_overall": 17,
                    "seasonScoredOver05Num_overall": 31,
                    "seasonScoredOver35Percentage_overall": 5,
                    "seasonScoredOver25Percentage_overall": 16,
                    "seasonScoredOver15Percentage_overall": 45,
                    "seasonScoredOver05Percentage_overall": 82,
                    "seasonScoredOver35Num_home": 2,
                    "seasonScoredOver25Num_home": 5,
                    "seasonScoredOver15Num_home": 11,
                    "seasonScoredOver05Num_home": 18,
                    "seasonScoredOver35Percentage_home": 11,
                    "seasonScoredOver25Percentage_home": 26,
                    "seasonScoredOver15Percentage_home": 57,
                    "seasonScoredOver05Percentage_home": 95,
                    "seasonScoredOver35Num_away": 0,
                    "seasonScoredOver25Num_away": 1,
                    "seasonScoredOver15Num_away": 6,
                    "seasonScoredOver05Num_away": 13,
                    "seasonScoredOver35Percentage_away": 0,
                    "seasonScoredOver25Percentage_away": 5,
                    "seasonScoredOver15Percentage_away": 32,
                    "seasonScoredOver05Percentage_away": 68,
                    "seasonConcededOver35Num_overall": 0,
                    "seasonConcededOver25Num_overall": 3,
                    "seasonConcededOver15Num_overall": 17,
                    "seasonConcededOver05Num_overall": 28,
                    "seasonConcededOver35Percentage_overall": 0,
                    "seasonConcededOver25Percentage_overall": 8,
                    "seasonConcededOver15Percentage_overall": 45,
                    "seasonConcededOver05Percentage_overall": 74,
                    "seasonConcededOver35Num_home": 0,
                    "seasonConcededOver25Num_home": 1,
                    "seasonConcededOver15Num_home": 9,
                    "seasonConcededOver05Num_home": 14,
                    "seasonConcededOver35Percentage_home": 0,
                    "seasonConcededOver25Percentage_home": 5,
                    "seasonConcededOver15Percentage_home": 47,
                    "seasonConcededOver05Percentage_home": 74,
                    "formRun_overall": "wwlddwdwlddlddlwlddlwddddwwwllwwwdlwlw",
                    "formRun_home": "wdwwdddlllwdwwwwdww",
                    "formRun_away": "wlddlldwdddddllwwll",
                    "seasonConcededOver35Num_away": 0,
                    "seasonConcededOver25Num_away": 2,
                    "seasonConcededOver15Num_away": 8,
                    "seasonConcededOver05Num_away": 14,
                    "seasonConcededOver35Percentage_away": 0,
                    "seasonConcededOver25Percentage_away": 11,
                    "seasonConcededOver15Percentage_away": 42,
                    "seasonConcededOver05Percentage_away": 74,
                    "cardTimingRecorded_matches_overall": 38,
                    "cardTimingRecorded_matches_home": 19,
                    "cardTimingRecorded_matches_away": 19,
                    "cardsRecorded_matches_overall": 38,
                    "cardsRecorded_matches_home": 19,
                    "cardsRecorded_matches_away": 19,
                    "fh_cards_total_overall": 63,
                    "fh_cards_total_home": 32,
                    "fh_cards_total_away": 31,
                    "2h_cards_total_overall": 109,
                    "2h_cards_total_home": 51,
                    "2h_cards_total_away": 58,
                    "fh_cards_for_overall": 28,
                    "fh_cards_for_home": 14,
                    "fh_cards_for_away": 14,
                    "2h_cards_for_overall": 64,
                    "2h_cards_for_home": 31,
                    "2h_cards_for_away": 33,
                    "fh_cards_against_overall": 35,
                    "fh_cards_against_home": 18,
                    "fh_cards_against_away": 17,
                    "2h_cards_against_overall": 45,
                    "2h_cards_against_home": 20,
                    "2h_cards_against_away": 25,
                    "fh_cards_for_avg_overall": 0.74,
                    "fh_cards_for_avg_home": 0.74,
                    "fh_cards_for_avg_away": 0.74,
                    "2h_cards_for_avg_overall": 1.68,
                    "2h_cards_for_avg_home": 1.63,
                    "2h_cards_for_avg_away": 1.74,
                    "fh_cards_against_avg_overall": 0.92,
                    "fh_cards_against_avg_home": 0.95,
                    "fh_cards_against_avg_away": 0.89,
                    "2h_cards_against_avg_overall": 1.18,
                    "2h_cards_against_avg_home": 1.05,
                    "2h_cards_against_avg_away": 1.32,
                    "fh_cards_total_avg_overall": 1.66,
                    "fh_cards_total_avg_home": 1.68,
                    "fh_cards_total_avg_away": 1.63,
                    "2h_cards_total_avg_overall": 2.87,
                    "2h_cards_total_avg_home": 2.68,
                    "2h_cards_total_avg_away": 3.05,
                    "fh_total_cards_under2_percentage_overall": 50,
                    "fh_total_cards_under2_percentage_home": 47,
                    "fh_total_cards_under2_percentage_away": 53,
                    "fh_total_cards_2to3_percentage_overall": 37,
                    "fh_total_cards_2to3_percentage_home": 37,
                    "fh_total_cards_2to3_percentage_away": 37,
                    "fh_total_cards_over3_percentage_overall": 13,
                    "fh_total_cards_over3_percentage_home": 16,
                    "fh_total_cards_over3_percentage_away": 11,
                    "2h_total_cards_under2_percentage_overall": 18,
                    "2h_total_cards_under2_percentage_home": 16,
                    "2h_total_cards_under2_percentage_away": 21,
                    "2h_total_cards_2to3_percentage_overall": 53,
                    "2h_total_cards_2to3_percentage_home": 57,
                    "2h_total_cards_2to3_percentage_away": 47,
                    "2h_total_cards_over3_percentage_overall": 28,
                    "2h_total_cards_over3_percentage_home": 26,
                    "2h_total_cards_over3_percentage_away": 32,
                    "fh_half_with_most_cards_total_percentage_overall": 13,
                    "fh_half_with_most_cards_total_percentage_home": 5,
                    "fh_half_with_most_cards_total_percentage_away": 21,
                    "2h_half_with_most_cards_total_percentage_overall": 57,
                    "2h_half_with_most_cards_total_percentage_home": 57,
                    "2h_half_with_most_cards_total_percentage_away": 57,
                    "fh_cards_for_over05_percentage_overall": 53,
                    "fh_cards_for_over05_percentage_home": 42,
                    "fh_cards_for_over05_percentage_away": 63,
                    "2h_cards_for_over05_percentage_overall": 92,
                    "2h_cards_for_over05_percentage_home": 89,
                    "2h_cards_for_over05_percentage_away": 95,
                    "cards_for_overall": 96,
                    "cards_for_home": 46,
                    "cards_for_away": 50,
                    "cards_against_overall": 81,
                    "cards_against_home": 38,
                    "cards_against_away": 43,
                    "cards_for_avg_overall": 2.53,
                    "cards_for_avg_home": 2.42,
                    "cards_for_avg_away": 2.63,
                    "cards_against_avg_overall": 2.13,
                    "cards_against_avg_home": 2,
                    "cards_against_avg_away": 2.26,
                    "cards_total_overall": 177,
                    "cards_total_home": 84,
                    "cards_total_away": 93,
                    "cards_total_avg_overall": 4.66,
                    "cards_total_avg_home": 4.42,
                    "cards_total_avg_away": 4.89,
                    "penalties_won_overall": 3,
                    "penalties_won_home": 2,
                    "penalties_won_away": 1,
                    "penalties_scored_overall": 3,
                    "penalties_scored_home": 2,
                    "penalties_scored_away": 1,
                    "penalties_missed_overall": 3,
                    "penalties_missed_home": 2,
                    "penalties_missed_away": 1,
                    "penalties_won_per_match_overall": 0.08,
                    "penalties_won_per_match_home": 0.11,
                    "penalties_won_per_match_away": 0.05,
                    "penalties_recorded_matches_overall": 38,
                    "penalties_recorded_matches_home": 19,
                    "penalties_recorded_matches_away": 19,
                    "exact_team_goals_0_ft_overall": 7,
                    "exact_team_goals_1_ft_overall": 14,
                    "exact_team_goals_2_ft_overall": 11,
                    "exact_team_goals_3_ft_overall": 4,
                    "exact_team_goals_1_ft_home": 7,
                    "exact_team_goals_2_ft_home": 6,
                    "exact_team_goals_3_ft_home": 3,
                    "exact_team_goals_0_ft_away": 6,
                    "exact_team_goals_1_ft_away": 7,
                    "exact_team_goals_2_ft_away": 5,
                    "exact_team_goals_3_ft_away": 1,
                    "match_shots_over235_num_overall": 26,
                    "match_shots_over245_num_overall": 21,
                    "match_shots_over255_num_overall": 21,
                    "match_shots_over265_num_overall": 17,
                    "match_shots_over235_num_home": 14,
                    "match_shots_over245_num_home": 13,
                    "match_shots_over255_num_home": 13,
                    "match_shots_over265_num_home": 10,
                    "match_shots_over235_num_away": 12,
                    "match_shots_over245_num_away": 8,
                    "match_shots_over255_num_away": 8,
                    "match_shots_over265_num_away": 7,
                    "match_shots_over235_percentage_overall": 68,
                    "match_shots_over245_percentage_overall": 55,
                    "match_shots_over255_percentage_overall": 55,
                    "match_shots_over265_percentage_overall": 45,
                    "match_shots_over235_percentage_home": 74,
                    "match_shots_over245_percentage_home": 68,
                    "match_shots_over255_percentage_home": 68,
                    "match_shots_over265_percentage_home": 53,
                    "match_shots_over235_percentage_away": 63,
                    "match_shots_over245_percentage_away": 42,
                    "match_shots_over255_percentage_away": 42,
                    "match_shots_over265_percentage_away": 37,
                    "match_shots_on_target_over75_num_overall": 30,
                    "match_shots_on_target_over85_num_overall": 30,
                    "match_shots_on_target_over95_num_overall": 27,
                    "match_shots_on_target_over75_num_home": 18,
                    "match_shots_on_target_over85_num_home": 18,
                    "match_shots_on_target_over95_num_home": 15,
                    "match_shots_on_target_over75_num_away": 12,
                    "match_shots_on_target_over85_num_away": 12,
                    "match_shots_on_target_over95_num_away": 12,
                    "match_shots_on_target_over75_percentage_overall": 79,
                    "match_shots_on_target_over85_percentage_overall": 79,
                    "match_shots_on_target_over95_percentage_overall": 71,
                    "match_shots_on_target_over75_percentage_home": 95,
                    "match_shots_on_target_over85_percentage_home": 95,
                    "match_shots_on_target_over95_percentage_home": 79,
                    "match_shots_on_target_over75_percentage_away": 63,
                    "match_shots_on_target_over85_percentage_away": 63,
                    "match_shots_on_target_over95_percentage_away": 63,
                    "team_shots_over105_num_overall": 19,
                    "team_shots_over115_num_overall": 16,
                    "team_shots_over125_num_overall": 14,
                    "team_shots_over135_num_overall": 11,
                    "team_shots_over145_num_overall": 7,
                    "team_shots_over155_num_overall": 5,
                    "team_shots_over105_num_home": 11,
                    "team_shots_over115_num_home": 10,
                    "team_shots_over125_num_home": 9,
                    "team_shots_over135_num_home": 6,
                    "team_shots_over145_num_home": 6,
                    "team_shots_over155_num_home": 6,
                    "team_shots_over105_num_away": 8,
                    "team_shots_over115_num_away": 6,
                    "team_shots_over125_num_away": 5,
                    "team_shots_over135_num_away": 5,
                    "team_shots_over145_num_away": 5,
                    "team_shots_over155_num_away": 5,
                    "team_shots_over105_percentage_overall": 50,
                    "team_shots_over115_percentage_overall": 42,
                    "team_shots_over125_percentage_overall": 37,
                    "team_shots_over135_percentage_overall": 28,
                    "team_shots_over145_percentage_overall": 18,
                    "team_shots_over155_percentage_overall": 13,
                    "team_shots_over105_percentage_home": 57,
                    "team_shots_over115_percentage_home": 53,
                    "team_shots_over125_percentage_home": 47,
                    "team_shots_over135_percentage_home": 32,
                    "team_shots_over145_percentage_home": 32,
                    "team_shots_over155_percentage_home": 32,
                    "team_shots_over105_percentage_away": 42,
                    "team_shots_over115_percentage_away": 32,
                    "team_shots_over125_percentage_away": 26,
                    "team_shots_over135_percentage_away": 26,
                    "team_shots_over145_percentage_away": 26,
                    "team_shots_over155_percentage_away": 26,
                    "team_shots_on_target_over35_num_overall": 26,
                    "team_shots_on_target_over45_num_overall": 20,
                    "team_shots_on_target_over55_num_overall": 16,
                    "team_shots_on_target_over65_num_overall": 10,
                    "team_shots_on_target_over35_num_home": 14,
                    "team_shots_on_target_over45_num_home": 12,
                    "team_shots_on_target_over55_num_home": 10,
                    "team_shots_on_target_over65_num_home": 6,
                    "team_shots_on_target_over35_num_away": 12,
                    "team_shots_on_target_over45_num_away": 8,
                    "team_shots_on_target_over55_num_away": 6,
                    "team_shots_on_target_over65_num_away": 4,
                    "team_shots_on_target_over35_percentage_overall": 68,
                    "team_shots_on_target_over45_percentage_overall": 53,
                    "team_shots_on_target_over55_percentage_overall": 42,
                    "team_shots_on_target_over65_percentage_overall": 26,
                    "team_shots_on_target_over35_percentage_home": 74,
                    "team_shots_on_target_over45_percentage_home": 63,
                    "team_shots_on_target_over55_percentage_home": 53,
                    "team_shots_on_target_over65_percentage_home": 32,
                    "team_shots_on_target_over35_percentage_away": 63,
                    "team_shots_on_target_over45_percentage_away": 42,
                    "team_shots_on_target_over55_percentage_away": 32,
                    "team_shots_on_target_over65_percentage_away": 21,
                    "win_0_10_num_overall": 4,
                    "win_0_10_num_home": 4,
                    "win_0_10_num_away": 0,
                    "draw_0_10_num_overall": 30,
                    "draw_0_10_num_home": 11,
                    "draw_0_10_num_away": 19,
                    "loss_0_10_num_overall": 4,
                    "loss_0_10_num_home": 4,
                    "loss_0_10_num_away": 0,
                    "win_0_10_percentage_overall": 11,
                    "win_0_10_percentage_home": 21,
                    "win_0_10_percentage_away": 0,
                    "draw_0_10_percentage_overall": 79,
                    "draw_0_10_percentage_home": 57,
                    "draw_0_10_percentage_away": 100,
                    "loss_0_10_percentage_overall": 11,
                    "loss_0_10_percentage_home": 21,
                    "loss_0_10_percentage_away": 0,
                    "total_goal_over05_0_10_num_overall": 8,
                    "total_goal_over05_0_10_num_home": 8,
                    "total_goal_over05_0_10_num_away": 0,
                    "total_corner_over05_0_10_num_overall": 31,
                    "total_corner_over05_0_10_num_home": 16,
                    "total_corner_over05_0_10_num_away": 15,
                    "total_cards_over05_0_10_num_overall": 6,
                    "total_cards_over05_0_10_num_home": 5,
                    "total_cards_over05_0_10_num_away": 1,
                    "total_goal_over05_0_10_percentage_overall": 21,
                    "total_goal_over05_0_10_percentage_home": 42,
                    "total_goal_over05_0_10_percentage_away": 0,
                    "total_corner_over05_0_10_percentage_overall": 84,
                    "total_corner_over05_0_10_percentage_home": 89,
                    "total_corner_over05_0_10_percentage_away": 79,
                    "total_cards_over05_0_10_percentage_overall": 16,
                    "total_cards_over05_0_10_percentage_home": 26,
                    "total_cards_over05_0_10_percentage_away": 5,
                    "fouls_recorded_overall": 38,
                    "fouls_recorded_home": 19,
                    "fouls_recorded_away": 19,
                    "fouls_against_num_overall": 458,
                    "fouls_against_num_home": 247,
                    "fouls_against_num_away": 211,
                    "fouls_against_avg_overall": 12.05,
                    "fouls_against_avg_home": 13,
                    "fouls_against_avg_away": 11.11,
                    "exact_team_goals_0_ft_percentage_overall": 18,
                    "exact_team_goals_1_ft_percentage_overall": 37,
                    "exact_team_goals_2_ft_percentage_overall": 28,
                    "exact_team_goals_3_ft_percentage_overall": 11,
                    "exact_team_goals_0_ft_percentage_home": 5,
                    "exact_team_goals_1_ft_percentage_home": 37,
                    "exact_team_goals_2_ft_percentage_home": 32,
                    "exact_team_goals_3_ft_percentage_home": 16,
                    "exact_team_goals_0_ft_percentage_away": 32,
                    "exact_team_goals_1_ft_percentage_away": 37,
                    "exact_team_goals_2_ft_percentage_away": 26,
                    "exact_team_goals_3_ft_percentage_away": 5,
                    "exact_total_goals_0_ft_overall": 2,
                    "exact_total_goals_1_ft_overall": 5,
                    "exact_total_goals_2_ft_overall": 10,
                    "exact_total_goals_3_ft_overall": 8,
                    "exact_total_goals_4_ft_overall": 10,
                    "exact_total_goals_5_ft_overall": 3,
                    "exact_total_goals_6_ft_overall": 0,
                    "exact_total_goals_7_ft_overall": 0,
                    "exact_total_goals_0_ft_home": 0,
                    "exact_total_goals_1_ft_home": 2,
                    "exact_total_goals_2_ft_home": 4,
                    "exact_total_goals_3_ft_home": 5,
                    "exact_total_goals_4_ft_home": 5,
                    "exact_total_goals_5_ft_home": 3,
                    "exact_total_goals_6_ft_home": 0,
                    "exact_total_goals_7_ft_home": 0,
                    "exact_total_goals_0_ft_away": 2,
                    "exact_total_goals_1_ft_away": 3,
                    "exact_total_goals_2_ft_away": 6,
                    "exact_total_goals_3_ft_away": 3,
                    "exact_total_goals_4_ft_away": 5,
                    "exact_total_goals_5_ft_away": 0,
                    "exact_total_goals_6_ft_away": 0,
                    "exact_total_goals_7_ft_away": 0,
                    "shots_recorded_matches_num_overall": 38,
                    "shots_recorded_matches_num_home": 19,
                    "shots_recorded_matches_num_away": 19,
                    "over25_and_btts_num_overall": 17,
                    "over25_and_btts_num_home": 10,
                    "over25_and_btts_num_away": 7,
                    "over25_and_no_btts_num_overall": 4,
                    "over25_and_no_btts_num_home": 3,
                    "over25_and_no_btts_num_away": 1,
                    "over25_and_btts_percentage_overall": 45,
                    "over25_and_btts_percentage_home": 53,
                    "over25_and_btts_percentage_away": 37,
                    "over25_and_no_btts_percentage_overall": 11,
                    "over25_and_no_btts_percentage_home": 16,
                    "over25_and_no_btts_percentage_away": 5,
                    "btts_1h2h_yes_yes_num_overall": 1,
                    "btts_1h2h_yes_yes_num_home": 1,
                    "btts_1h2h_yes_yes_num_away": 0,
                    "btts_1h2h_yes_no_num_overall": 8,
                    "btts_1h2h_yes_no_num_home": 6,
                    "btts_1h2h_yes_no_num_away": 2,
                    "btts_1h2h_no_no_num_overall": 24,
                    "btts_1h2h_no_no_num_home": 10,
                    "btts_1h2h_no_no_num_away": 14,
                    "btts_1h2h_no_yes_num_overall": 5,
                    "btts_1h2h_no_yes_num_home": 2,
                    "btts_1h2h_no_yes_num_away": 3,
                    "half_with_most_goals_is_1h_num_overall": 13,
                    "half_with_most_goals_is_1h_num_home": 9,
                    "half_with_most_goals_is_1h_num_away": 4,
                    "half_with_most_goals_is_2h_num_overall": 12,
                    "half_with_most_goals_is_2h_num_home": 5,
                    "half_with_most_goals_is_2h_num_away": 7,
                    "half_with_most_goals_is_tie_num_overall": 13,
                    "half_with_most_goals_is_tie_num_home": 5,
                    "half_with_most_goals_is_tie_num_away": 8,
                    "half_with_most_goals_is_1h_percentage_overall": 34,
                    "half_with_most_goals_is_1h_percentage_home": 47,
                    "half_with_most_goals_is_1h_percentage_away": 21,
                    "half_with_most_goals_is_2h_percentage_overall": 32,
                    "half_with_most_goals_is_2h_percentage_away": 37,
                    "half_with_most_goals_is_tie_percentage_overall": 34,
                    "half_with_most_goals_is_tie_percentage_home": 26,
                    "half_with_most_goals_is_tie_percentage_away": 42,
                    "btts_1h2h_yes_yes_percentage_overall": 3,
                    "btts_1h2h_yes_yes_percentage_home": 5,
                    "btts_1h2h_yes_yes_percentage_away": 0,
                    "btts_1h2h_yes_no_percentage_overall": 21,
                    "btts_1h2h_yes_no_percentage_home": 32,
                    "btts_1h2h_yes_no_percentage_away": 11,
                    "btts_1h2h_no_no_percentage_overall": 63,
                    "btts_1h2h_no_no_percentage_home": 53,
                    "btts_1h2h_no_no_percentage_away": 74,
                    "btts_1h2h_no_yes_percentage_overall": 13,
                    "btts_1h2h_no_yes_percentage_home": 11,
                    "btts_1h2h_no_yes_percentage_away": 16,
                    "half_with_most_goals_is_2h_percentage_home": 26,
                    "shots_per_goals_scored_overall": 7.68,
                    "shots_per_goals_scored_home": 6.53,
                    "shots_per_goals_scored_away": 9.75,
                    "shots_on_target_per_goals_scored_overall": 3.38,
                    "shots_on_target_per_goals_scored_home": 3,
                    "shots_on_target_per_goals_scored_away": 4.05,
                    "shot_conversion_rate_overall": 13,
                    "shot_conversion_rate_home": 15,
                    "shot_conversion_rate_away": 10,
                    "team_with_most_corners_win_num_overall": 15,
                    "team_with_most_corners_win_num_home": 8,
                    "team_with_most_corners_win_num_away": 7,
                    "team_with_most_corners_win_1h_num_overall": 16,
                    "team_with_most_corners_win_1h_num_home": 11,
                    "team_with_most_corners_win_1h_num_away": 5,
                    "team_with_most_corners_win_2h_num_overall": 15,
                    "team_with_most_corners_win_2h_num_home": 8,
                    "team_with_most_corners_win_2h_num_away": 7,
                    "team_with_most_corners_win_percentage_overall": 39,
                    "team_with_most_corners_win_percentage_home": 42,
                    "team_with_most_corners_win_percentage_away": 37,
                    "team_with_most_corners_win_1h_percentage_overall": 43,
                    "team_with_most_corners_win_1h_percentage_home": 61,
                    "team_with_most_corners_win_1h_percentage_away": 26,
                    "team_with_most_corners_win_2h_percentage_overall": 41,
                    "team_with_most_corners_win_2h_percentage_home": 44,
                    "team_with_most_corners_win_2h_percentage_away": 37,
                    "half_with_most_corners_is_1h_num_overall": 14,
                    "half_with_most_corners_is_1h_num_home": 7,
                    "half_with_most_corners_is_1h_num_away": 7,
                    "half_with_most_corners_is_2h_num_overall": 18,
                    "half_with_most_corners_is_2h_num_home": 8,
                    "half_with_most_corners_is_2h_num_away": 10,
                    "half_with_most_corners_is_draw_num_overall": 5,
                    "half_with_most_corners_is_draw_num_home": 3,
                    "half_with_most_corners_is_draw_num_away": 2,
                    "half_with_most_corners_is_1h_percentage_overall": 38,
                    "half_with_most_corners_is_1h_percentage_home": 39,
                    "half_with_most_corners_is_1h_percentage_away": 37,
                    "half_with_most_corners_is_2h_percentage_overall": 49,
                    "half_with_most_corners_is_2h_percentage_home": 44,
                    "half_with_most_corners_is_2h_percentage_away": 53,
                    "half_with_most_corners_is_draw_percentage_overall": 14,
                    "half_with_most_corners_is_draw_percentage_home": 17,
                    "half_with_most_corners_is_draw_percentage_away": 11,
                    "corners_earned_1h_num_overall": 106,
                    "corners_earned_1h_num_home": 62,
                    "corners_earned_1h_num_away": 44,
                    "corners_earned_2h_num_overall": 115,
                    "corners_earned_2h_num_home": 56,
                    "corners_earned_2h_num_away": 59,
                    "corners_earned_1h_avg_overall": 2.86,
                    "corners_earned_1h_avg_home": 3.44,
                    "corners_earned_1h_avg_away": 2.32,
                    "corners_earned_2h_avg_overall": 3.11,
                    "corners_earned_2h_avg_home": 3.11,
                    "corners_earned_2h_avg_away": 3.11,
                    "corners_earned_1h_over2_num_overall": 15,
                    "corners_earned_1h_over2_num_home": 10,
                    "corners_earned_1h_over2_num_away": 5,
                    "corners_earned_1h_over3_num_overall": 11,
                    "corners_earned_1h_over3_num_home": 8,
                    "corners_earned_1h_over3_num_away": 3,
                    "corners_earned_2h_over2_num_overall": 24,
                    "corners_earned_2h_over2_num_home": 11,
                    "corners_earned_2h_over2_num_away": 13,
                    "corners_earned_2h_over3_num_overall": 15,
                    "corners_earned_2h_over3_num_home": 7,
                    "corners_earned_2h_over3_num_away": 8,
                    "corners_earned_1h_2_to_3_num_overall": 14,
                    "corners_earned_1h_2_to_3_num_home": 5,
                    "corners_earned_1h_2_to_3_num_away": 9,
                    "corners_earned_2h_2_to_3_num_overall": 12,
                    "corners_earned_2h_2_to_3_num_home": 5,
                    "corners_earned_2h_2_to_3_num_away": 7,
                    "corners_earned_1h_over2_percentage_overall": 41,
                    "corners_earned_1h_over2_percentage_home": 56,
                    "corners_earned_1h_over2_percentage_away": 26,
                    "corners_earned_1h_over3_percentage_overall": 30,
                    "corners_earned_1h_over3_percentage_home": 44,
                    "corners_earned_1h_over3_percentage_away": 16,
                    "corners_earned_2h_over2_percentage_overall": 65,
                    "corners_earned_2h_over2_percentage_home": 61,
                    "corners_earned_2h_over2_percentage_away": 68,
                    "corners_earned_2h_over3_percentage_overall": 41,
                    "corners_earned_2h_over3_percentage_home": 39,
                    "corners_earned_2h_over3_percentage_away": 42,
                    "corners_earned_1h_2_to_3_percentage_overall": 38,
                    "corners_earned_1h_2_to_3_percentage_home": 28,
                    "corners_earned_1h_2_to_3_percentage_away": 47,
                    "corners_earned_2h_2_to_3_percentage_overall": 32,
                    "corners_earned_2h_2_to_3_percentage_home": 28,
                    "corners_earned_2h_2_to_3_percentage_away": 37,
                    "penalties_conceded_overall": 8,
                    "penalties_conceded_home": 4,
                    "penalties_conceded_away": 4,
                    "penalty_in_a_match_overall": 10,
                    "penalty_in_a_match_home": 5,
                    "penalty_in_a_match_away": 5,
                    "penalty_in_a_match_percentage_overall": 26,
                    "penalty_in_a_match_percentage_home": 26,
                    "penalty_in_a_match_percentage_away": 26,
                    "goal_kicks_recorded_matches_overall": 28,
                    "goal_kicks_recorded_matches_home": 11,
                    "goal_kicks_recorded_matches_away": 17,
                    "goal_kicks_team_num_overall": 228,
                    "goal_kicks_team_num_home": 72,
                    "goal_kicks_team_num_away": 156,
                    "goal_kicks_total_num_overall": 392,
                    "goal_kicks_total_num_home": 144,
                    "goal_kicks_total_num_away": 248,
                    "goal_kicks_team_avg_overall": 8.14,
                    "goal_kicks_team_avg_home": 6.55,
                    "goal_kicks_team_avg_away": 9.18,
                    "goal_kicks_total_avg_overall": 14,
                    "goal_kicks_total_avg_home": 13.09,
                    "goal_kicks_total_avg_away": 14.59,
                    "goal_kicks_team_over35_overall": 86,
                    "goal_kicks_team_over35_home": 64,
                    "goal_kicks_team_over35_away": 100,
                    "goal_kicks_team_over45_overall": 82,
                    "goal_kicks_team_over45_home": 64,
                    "goal_kicks_team_over45_away": 94,
                    "goal_kicks_team_over55_overall": 79,
                    "goal_kicks_team_over55_home": 64,
                    "goal_kicks_team_over55_away": 88,
                    "goal_kicks_team_over65_overall": 75,
                    "goal_kicks_team_over65_home": 55,
                    "goal_kicks_team_over65_away": 88,
                    "goal_kicks_team_over75_overall": 64,
                    "goal_kicks_team_over75_home": 45,
                    "goal_kicks_team_over75_away": 76,
                    "goal_kicks_team_over85_overall": 50,
                    "goal_kicks_team_over85_home": 36,
                    "goal_kicks_team_over85_away": 59,
                    "goal_kicks_team_over95_overall": 32,
                    "goal_kicks_team_over95_home": 9,
                    "goal_kicks_team_over95_away": 47,
                    "goal_kicks_team_over105_overall": 21,
                    "goal_kicks_team_over105_home": 9,
                    "goal_kicks_team_over105_away": 28,
                    "goal_kicks_team_over115_overall": 11,
                    "goal_kicks_team_over115_home": 9,
                    "goal_kicks_team_over115_away": 12,
                    "goal_kicks_total_over85_overall": 96,
                    "goal_kicks_total_over85_home": 91,
                    "goal_kicks_total_over85_away": 100,
                    "goal_kicks_total_over95_overall": 93,
                    "goal_kicks_total_over95_home": 82,
                    "goal_kicks_total_over95_away": 100,
                    "goal_kicks_total_over105_overall": 86,
                    "goal_kicks_total_over105_home": 82,
                    "goal_kicks_total_over105_away": 88,
                    "goal_kicks_total_over115_overall": 75,
                    "goal_kicks_total_over115_home": 73,
                    "goal_kicks_total_over115_away": 76,
                    "goal_kicks_total_over125_overall": 64,
                    "goal_kicks_total_over125_home": 64,
                    "goal_kicks_total_over125_away": 65,
                    "goal_kicks_total_over135_overall": 54,
                    "goal_kicks_total_over135_home": 55,
                    "goal_kicks_total_over135_away": 53,
                    "goal_kicks_total_over145_overall": 43,
                    "goal_kicks_total_over145_home": 45,
                    "goal_kicks_total_over145_away": 41,
                    "goal_kicks_total_over155_overall": 36,
                    "goal_kicks_total_over155_home": 27,
                    "goal_kicks_total_over155_away": 41,
                    "goal_kicks_total_over165_overall": 25,
                    "goal_kicks_total_over165_home": 18,
                    "goal_kicks_total_over165_away": 28,
                    "goal_kicks_total_over175_overall": 18,
                    "goal_kicks_total_over175_home": 9,
                    "goal_kicks_total_over175_away": 24,
                    "goal_kicks_total_over185_overall": 11,
                    "goal_kicks_total_over185_home": 0,
                    "goal_kicks_total_over185_away": 18,
                    "throwins_recorded_matches_overall": 36,
                    "throwins_recorded_matches_home": 17,
                    "throwins_recorded_matches_away": 19,
                    "throwins_team_num_overall": 542,
                    "throwins_team_num_home": 181,
                    "throwins_team_num_away": 361,
                    "throwins_total_num_overall": 1108,
                    "throwins_total_num_home": 389,
                    "throwins_total_num_away": 719,
                    "throwins_team_avg_overall": 15.06,
                    "throwins_team_avg_home": 10.65,
                    "throwins_team_avg_away": 19,
                    "throwins_total_avg_overall": 30.78,
                    "throwins_total_avg_home": 22.88,
                    "throwins_total_avg_away": 37.84,
                    "throwins_team_over155_overall": 53,
                    "throwins_team_over155_home": 35,
                    "throwins_team_over155_away": 68,
                    "throwins_team_over165_overall": 50,
                    "throwins_team_over165_home": 28,
                    "throwins_team_over165_away": 68,
                    "throwins_team_over175_overall": 47,
                    "throwins_team_over175_home": 24,
                    "throwins_team_over175_away": 68,
                    "throwins_team_over185_overall": 44,
                    "throwins_team_over185_home": 18,
                    "throwins_team_over185_away": 68,
                    "throwins_team_over195_overall": 39,
                    "throwins_team_over195_home": 18,
                    "throwins_team_over195_away": 57,
                    "throwins_team_over205_overall": 31,
                    "throwins_team_over205_home": 12,
                    "throwins_team_over205_away": 47,
                    "throwins_team_over215_overall": 28,
                    "throwins_team_over215_home": 6,
                    "throwins_team_over215_away": 47,
                    "throwins_team_over225_overall": 25,
                    "throwins_team_over225_home": 6,
                    "throwins_team_over225_away": 42,
                    "throwins_team_over235_overall": 19,
                    "throwins_team_over235_home": 6,
                    "throwins_team_over235_away": 32,
                    "throwins_team_over245_overall": 17,
                    "throwins_team_over245_home": 6,
                    "throwins_team_over245_away": 26,
                    "throwins_team_over255_overall": 17,
                    "throwins_team_over255_home": 6,
                    "throwins_team_over255_away": 26,
                    "throwins_total_over375_overall": 47,
                    "throwins_total_over375_home": 24,
                    "throwins_total_over375_away": 68,
                    "throwins_total_over385_overall": 44,
                    "throwins_total_over385_home": 24,
                    "throwins_total_over385_away": 63,
                    "throwins_total_over395_overall": 39,
                    "throwins_total_over395_home": 18,
                    "throwins_total_over395_away": 57,
                    "throwins_total_over405_overall": 39,
                    "throwins_total_over405_home": 18,
                    "throwins_total_over405_away": 57,
                    "throwins_total_over415_overall": 36,
                    "throwins_total_over415_home": 18,
                    "throwins_total_over415_away": 53,
                    "throwins_total_over425_overall": 31,
                    "throwins_total_over425_home": 12,
                    "throwins_total_over425_away": 47,
                    "throwins_total_over435_overall": 31,
                    "throwins_total_over435_home": 12,
                    "throwins_total_over435_away": 47,
                    "throwins_total_over445_overall": 28,
                    "throwins_total_over445_home": 12,
                    "throwins_total_over445_away": 42,
                    "throwins_total_over455_overall": 22,
                    "throwins_total_over455_home": 12,
                    "throwins_total_over455_away": 32,
                    "throwins_total_over465_overall": 19,
                    "throwins_total_over465_home": 12,
                    "throwins_total_over465_away": 26,
                    "throwins_total_over475_overall": 17,
                    "throwins_total_over475_home": 6,
                    "throwins_total_over475_away": 26,
                    "freekicks_recorded_matches_overall": 28,
                    "freekicks_recorded_matches_home": 11,
                    "freekicks_recorded_matches_away": 17,
                    "freekicks_team_num_overall": 372,
                    "freekicks_team_num_home": 162,
                    "freekicks_team_num_away": 210,
                    "freekicks_total_num_overall": 712,
                    "freekicks_total_num_home": 302,
                    "freekicks_total_num_away": 410,
                    "freekicks_team_avg_overall": 13.29,
                    "freekicks_team_avg_home": 14.73,
                    "freekicks_team_avg_away": 12.35,
                    "freekicks_total_avg_overall": 25.43,
                    "freekicks_total_avg_home": 27.45,
                    "freekicks_total_avg_away": 24.12,
                    "freekicks_team_over75_overall": 89,
                    "freekicks_team_over75_home": 91,
                    "freekicks_team_over75_away": 88,
                    "freekicks_team_over85_overall": 86,
                    "freekicks_team_over85_home": 91,
                    "freekicks_team_over85_away": 82,
                    "freekicks_team_over95_overall": 86,
                    "freekicks_team_over95_home": 91,
                    "freekicks_team_over95_away": 82,
                    "freekicks_team_over105_overall": 75,
                    "freekicks_team_over105_home": 91,
                    "freekicks_team_over105_away": 65,
                    "freekicks_team_over115_overall": 68,
                    "freekicks_team_over115_home": 82,
                    "freekicks_team_over115_away": 59,
                    "freekicks_team_over125_overall": 61,
                    "freekicks_team_over125_home": 82,
                    "freekicks_team_over125_away": 47,
                    "freekicks_team_over135_overall": 46,
                    "freekicks_team_over135_home": 73,
                    "freekicks_team_over135_away": 28,
                    "freekicks_team_over145_overall": 32,
                    "freekicks_team_over145_home": 45,
                    "freekicks_team_over145_away": 24,
                    "freekicks_team_over155_overall": 21,
                    "freekicks_team_over155_home": 27,
                    "freekicks_team_over155_away": 18,
                    "freekicks_team_over165_overall": 21,
                    "freekicks_team_over165_home": 27,
                    "freekicks_team_over165_away": 18,
                    "freekicks_team_over175_overall": 18,
                    "freekicks_team_over175_home": 27,
                    "freekicks_team_over175_away": 12,
                    "freekicks_total_over205_overall": 75,
                    "freekicks_total_over205_home": 91,
                    "freekicks_total_over205_away": 65,
                    "freekicks_total_over215_overall": 71,
                    "freekicks_total_over215_home": 91,
                    "freekicks_total_over215_away": 59,
                    "freekicks_total_over225_overall": 68,
                    "freekicks_total_over225_home": 91,
                    "freekicks_total_over225_away": 53,
                    "freekicks_total_over235_overall": 50,
                    "freekicks_total_over235_home": 82,
                    "freekicks_total_over235_away": 28,
                    "freekicks_total_over245_overall": 50,
                    "freekicks_total_over245_home": 82,
                    "freekicks_total_over245_away": 28,
                    "freekicks_total_over255_overall": 50,
                    "freekicks_total_over255_home": 82,
                    "freekicks_total_over255_away": 28,
                    "freekicks_total_over265_overall": 46,
                    "freekicks_total_over265_home": 73,
                    "freekicks_total_over265_away": 28,
                    "freekicks_total_over275_overall": 46,
                    "freekicks_total_over275_home": 73,
                    "freekicks_total_over275_away": 28,
                    "freekicks_total_over285_overall": 36,
                    "freekicks_total_over285_home": 55,
                    "freekicks_total_over285_away": 24,
                    "freekicks_total_over295_overall": 25,
                    "freekicks_total_over295_home": 36,
                    "freekicks_total_over295_away": 18,
                    "freekicks_total_over305_overall": 25,
                    "freekicks_total_over305_home": 36,
                    "freekicks_total_over305_away": 18
                },
                "goals_scored_min_0_to_10": 5,
                "goals_conceded_min_0_to_10": 4,
                "goals_scored_min_11_to_20": 6,
                "goals_conceded_min_11_to_20": 4,
                "goals_scored_min_21_to_30": 6,
                "goals_conceded_min_21_to_30": 4,
                "goals_scored_min_31_to_40": 6,
                "goals_conceded_min_31_to_40": 6,
                "goals_scored_min_41_to_50": 7,
                "goals_conceded_min_41_to_50": 8,
                "goals_scored_min_51_to_60": 7,
                "goals_conceded_min_51_to_60": 6,
                "goals_scored_min_61_to_70": 7,
                "goals_conceded_min_61_to_70": 2,
                "goals_scored_min_71_to_80": 2,
                "goals_conceded_min_71_to_80": 5,
                "goals_scored_min_81_to_90": 10,
                "goals_conceded_min_81_to_90": 9,
                "goals_all_min_0_to_10": 9,
                "goals_all_min_11_to_20": 10,
                "goals_all_min_21_to_30": 10,
                "goals_all_min_31_to_40": 12,
                "goals_all_min_41_to_50": 15,
                "goals_all_min_51_to_60": 13,
                "goals_all_min_61_to_70": 9,
                "goals_all_min_71_to_80": 7,
                "goals_all_min_81_to_90": 19,
                "goals_all_min_0_to_15": 13,
                "goals_all_min_16_to_30": 16,
                "goals_all_min_31_to_45": 24,
                "goals_all_min_46_to_60": 16,
                "goals_all_min_61_to_75": 13,
                "goals_all_min_76_to_90": 22,
                "goals_scored_min_0_to_15": 8,
                "goals_scored_min_16_to_30": 9,
                "goals_scored_min_31_to_45": 11,
                "goals_scored_min_46_to_60": 9,
                "goals_scored_min_61_to_75": 8,
                "goals_scored_min_76_to_90": 11,
                "goals_conceded_min_0_to_15": 5,
                "goals_conceded_min_16_to_30": 7,
                "goals_conceded_min_31_to_45": 13,
                "goals_conceded_min_46_to_60": 7,
                "goals_conceded_min_61_to_75": 5,
                "goals_conceded_min_76_to_90": 11,
                "goals_scored_min_0_to_10_home": 5,
                "goals_scored_min_11_to_20_home": 3,
                "goals_scored_min_21_to_30_home": 4,
                "goals_scored_min_31_to_40_home": 5,
                "goals_scored_min_41_to_50_home": 6,
                "goals_scored_min_51_to_60_home": 3,
                "goals_scored_min_61_to_70_home": 2,
                "goals_scored_min_71_to_80_home": 2,
                "goals_scored_min_81_to_90_home": 6,
                "goals_scored_min_0_to_15_home": 7,
                "goals_scored_min_16_to_30_home": 5,
                "goals_scored_min_31_to_45_home": 9,
                "goals_scored_min_46_to_60_home": 5,
                "goals_scored_min_61_to_75_home": 3,
                "goals_scored_min_76_to_90_home": 7,
                "goals_conceded_min_0_to_10_home": 4,
                "goals_conceded_min_11_to_20_home": 3,
                "goals_conceded_min_21_to_30_home": 0,
                "goals_conceded_min_31_to_40_home": 4,
                "goals_conceded_min_41_to_50_home": 3,
                "goals_conceded_min_51_to_60_home": 2,
                "goals_conceded_min_61_to_70_home": 1,
                "goals_conceded_min_71_to_80_home": 3,
                "goals_conceded_min_81_to_90_home": 4,
                "goals_conceded_min_0_to_15_home": 5,
                "goals_conceded_min_16_to_30_home": 2,
                "goals_conceded_min_31_to_45_home": 7,
                "goals_conceded_min_46_to_60_home": 2,
                "goals_conceded_min_61_to_75_home": 2,
                "goals_conceded_min_76_to_90_home": 6,
                "goals_all_min_0_to_10_home": 9,
                "goals_all_min_11_to_20_home": 6,
                "goals_all_min_21_to_30_home": 4,
                "goals_all_min_31_to_40_home": 9,
                "goals_all_min_41_to_50_home": 9,
                "goals_all_min_51_to_60_home": 5,
                "goals_all_min_61_to_70_home": 3,
                "goals_all_min_71_to_80_home": 5,
                "goals_all_min_81_to_90_home": 10,
                "goals_all_min_0_to_15_home": 12,
                "goals_all_min_16_to_30_home": 7,
                "goals_all_min_31_to_45_home": 16,
                "goals_all_min_46_to_60_home": 7,
                "goals_all_min_61_to_75_home": 5,
                "goals_all_min_76_to_90_home": 13,
                "goals_scored_min_0_to_10_away": 0,
                "goals_scored_min_11_to_20_away": 3,
                "goals_scored_min_21_to_30_away": 2,
                "goals_scored_min_31_to_40_away": 1,
                "goals_scored_min_41_to_50_away": 1,
                "goals_scored_min_51_to_60_away": 4,
                "goals_scored_min_61_to_70_away": 5,
                "goals_scored_min_71_to_80_away": 0,
                "goals_scored_min_81_to_90_away": 4,
                "goals_scored_min_0_to_15_away": 1,
                "goals_scored_min_16_to_30_away": 4,
                "goals_scored_min_31_to_45_away": 2,
                "goals_scored_min_46_to_60_away": 4,
                "goals_scored_min_61_to_75_away": 5,
                "goals_scored_min_76_to_90_away": 4,
                "goals_conceded_min_0_to_10_away": 0,
                "goals_conceded_min_11_to_20_away": 1,
                "goals_conceded_min_21_to_30_away": 4,
                "goals_conceded_min_31_to_40_away": 2,
                "goals_conceded_min_41_to_50_away": 5,
                "goals_conceded_min_51_to_60_away": 4,
                "goals_conceded_min_61_to_70_away": 1,
                "goals_conceded_min_71_to_80_away": 2,
                "goals_conceded_min_81_to_90_away": 5,
                "goals_conceded_min_0_to_15_away": 0,
                "goals_conceded_min_16_to_30_away": 5,
                "goals_conceded_min_31_to_45_away": 6,
                "goals_conceded_min_46_to_60_away": 5,
                "goals_conceded_min_61_to_75_away": 3,
                "goals_conceded_min_76_to_90_away": 5,
                "goals_all_min_0_to_10_away": 0,
                "goals_all_min_11_to_20_away": 4,
                "goals_all_min_21_to_30_away": 6,
                "goals_all_min_31_to_40_away": 3,
                "goals_all_min_41_to_50_away": 6,
                "goals_all_min_51_to_60_away": 8,
                "goals_all_min_61_to_70_away": 6,
                "goals_all_min_71_to_80_away": 2,
                "goals_all_min_81_to_90_away": 9,
                "goals_all_min_0_to_15_away": 1,
                "goals_all_min_16_to_30_away": 9,
                "goals_all_min_31_to_45_away": 8,
                "goals_all_min_46_to_60_away": 9,
                "goals_all_min_61_to_75_away": 8,
                "goals_all_min_76_to_90_away": 9,
                "name_jp": "アーセナルFC",
                "name_tr": "Arsenal FC",
                "name_kr": "아스날",
                "name_pt": "Arsenal",
                "name_ru": "Арсенал",
                "name_es": "Arsenal FC",
                "name_se": "Arsenal",
                "name_de": "Arsenal FC",
                "name_zht": "阿森納",
                "name_nl": "Arsenal FC",
                "name_it": "Arsenal FC",
                "name_fr": "Arsenal FC",
                "name_id": "Arsenal FC",
                "name_pl": "Arsenal FC",
                "name_gr": "Αρσεναλ",
                "name_dk": "Arsenal FC",
                "name_th": "อาร์เซนอล",
                "name_hr": "Arsenal FC",
                "name_ro": "Arsenal FC",
                "name_in": "Arsenal FC",
                "name_no": "Arsenal FC",
                "name_hu": "Arsenal FC",
                "name_cz": "Arsenal FC",
                "name_cn": "阿森纳",
                "name_ara": "نادي أرسنال",
                "name_si": null,
                "name_vn": "Arsenal FC",
                "name_my": null,
                "name_sk": "Arsenal FC",
                "name_rs": null,
                "name_ua": null,
                "name_bg": "Arsenal FC",
                "name_lv": null,
                "name_ge": null,
                "name_swa": null,
                "name_kur": null,
                "name_ee": null,
                "name_lt": null,
                "name_ba": null,
                "name_by": null,
                "name_fi": "Arsenal FC",
                "women": null,
                "parent_url": null,
                "prediction_risk": 63
            }
        },
        {
            "id": 92,
            "original_id": 92,
            "name": "Tottenham Hotspur FC",
            "cleanName": "Tottenham Hotspur",
            "english_name": "Tottenham Hotspur FC",
            "shortHand": "tottenham-hotspur-fc",
            "country": "England",
            "continent": "",
            "image": "https://cdn.footystats.org/img/teams/england-tottenham-hotspur-fc.png",
            "flag_element": null,
            "season": "2018/2019",
            "seasonClean": null,
            "url": "https://footystats.org/clubs/england/tottenham-hotspur-fc",
            "stadium_name": "",
            "stadium_address": "",
            "table_position": 4,
            "performance_rank": 4,
            "risk": 89,
            "season_format": "Domestic League",
            "competition_id": 1625,
            "founded": "1882",
            "full_name": "Tottenham Hotspur FC",
            "alt_names": [],
            "official_sites": []
        },
        {
            "id": 93,
            "original_id": 93,
            "name": "Manchester City FC",
            "cleanName": "Manchester City",
            "english_name": "Manchester City FC",
            "shortHand": "manchester-city-fc",
            "country": "England",
            "continent": "",
            "image": "https://cdn.footystats.org/img/teams/england-manchester-city-fc.png",
            "flag_element": null,
            "season": "2018/2019",
            "seasonClean": null,
            "url": "https://footystats.org/clubs/england/manchester-city-fc",
            "stadium_name": "",
            "stadium_address": "",
            "table_position": 1,
            "performance_rank": 1,
            "risk": 92,
            "season_format": "Domestic League",
            "competition_id": 1625,
            "founded": "1880",
            "full_name": "Manchester City FC",
            "alt_names": [
                "Man City"
            ],
            "official_sites": []
        },
        {
            "id": 108,
            "original_id": 108,
            "name": "Leicester City FC",
            "cleanName": "Leicester City",
            "english_name": "Leicester City FC",
            "shortHand": "leicester-city-fc",
            "country": "England",
            "continent": "",
            "image": "https://cdn.footystats.org/img/teams/england-leicester-city-fc.png",
            "flag_element": null,
            "season": "2018/2019",
            "seasonClean": null,
            "url": "https://footystats.org/clubs/england/leicester-city-fc",
            "stadium_name": "",
            "stadium_address": "",
            "table_position": 9,
            "performance_rank": 9,
            "risk": 68,
            "season_format": "Domestic League",
            "competition_id": 1625,
            "founded": "1884",
            "full_name": "Leicester City FC",
            "alt_names": [
                "Leicester"
            ],
            "official_sites": []
        },
        {
            "id": 143,
            "original_id": 143,
            "name": "Crystal Palace FC",
            "cleanName": "Crystal Palace",
            "english_name": "Crystal Palace FC",
            "shortHand": "crystal-palace-fc",
            "country": "England",
            "continent": "",
            "image": "https://cdn.footystats.org/img/teams/england-crystal-palace-fc.png",
            "flag_element": null,
            "season": "2018/2019",
            "seasonClean": null,
            "url": "https://footystats.org/clubs/england/crystal-palace-fc",
            "stadium_name": "",
            "stadium_address": "",
            "table_position": 12,
            "performance_rank": 12,
            "risk": 76,
            "season_format": "Domestic League",
            "competition_id": 1625,
            "founded": "1905",
            "full_name": "Crystal Palace FC",
            "alt_names": [],
            "official_sites": {
                "Crystal Palace Offical": "https://www.cpfc.co.uk/"
            }
        },
        {
            "id": 144,
            "original_id": 144,
            "name": "Everton FC",
            "cleanName": "Everton",
            "english_name": "Everton FC",
            "shortHand": "everton-fc",
            "country": "England",
            "continent": "",
            "image": "https://cdn.footystats.org/img/teams/england-everton-fc.png",
            "flag_element": null,
            "season": "2018/2019",
            "seasonClean": null,
            "url": "https://footystats.org/clubs/england/everton-fc",
            "stadium_name": "",
            "stadium_address": "",
            "table_position": 8,
            "performance_rank": 8,
            "risk": 68,
            "season_format": "Domestic League",
            "competition_id": 1625,
            "founded": "1878",
            "full_name": "Everton FC",
            "alt_names": [],
            "official_sites": []
        },
        {
            "id": 145,
            "original_id": 145,
            "name": "Burnley FC",
            "cleanName": "Burnley",
            "english_name": "Burnley FC",
            "shortHand": "burnley-fc",
            "country": "England",
            "continent": "",
            "image": "https://cdn.footystats.org/img/teams/england-burnley-fc.png",
            "flag_element": null,
            "season": "2018/2019",
            "seasonClean": null,
            "url": "https://footystats.org/clubs/england/burnley-fc",
            "stadium_name": "",
            "stadium_address": "",
            "table_position": 15,
            "performance_rank": 15,
            "risk": 79,
            "season_format": "Domestic League",
            "competition_id": 1625,
            "founded": "1882",
            "full_name": "Burnley FC",
            "alt_names": [],
            "official_sites": []
        },
        {
            "id": 146,
            "original_id": 146,
            "name": "Southampton FC",
            "cleanName": "Southampton",
            "english_name": "Southampton FC",
            "shortHand": "southampton-fc",
            "country": "England",
            "continent": "",
            "image": "https://cdn.footystats.org/img/teams/england-southampton-fc.png",
            "flag_element": null,
            "season": "2018/2019",
            "seasonClean": null,
            "url": "https://footystats.org/clubs/england/southampton-fc",
            "stadium_name": "",
            "stadium_address": "",
            "table_position": 16,
            "performance_rank": 16,
            "risk": 76,
            "season_format": "Domestic League",
            "competition_id": 1625,
            "founded": "1885",
            "full_name": "Southampton FC",
            "alt_names": [],
            "official_sites": []
        },
        {
            "id": 148,
            "original_id": 148,
            "name": "AFC Bournemouth",
            "cleanName": "AFC Bournemouth",
            "english_name": "AFC Bournemouth",
            "shortHand": "afc-bournemouth",
            "country": "England",
            "continent": "",
            "image": "https://cdn.footystats.org/img/teams/england-afc-bournemouth.png",
            "flag_element": null,
            "season": "2018/2019",
            "seasonClean": null,
            "url": "https://footystats.org/clubs/england/afc-bournemouth",
            "stadium_name": "",
            "stadium_address": "",
            "table_position": 14,
            "performance_rank": 14,
            "risk": 79,
            "season_format": "Domestic League",
            "competition_id": 1625,
            "founded": "1899",
            "full_name": "AFC Bournemouth",
            "alt_names": [],
            "official_sites": {
                "AFCB.co.uk": "https://www.afcb.co.uk/"
            }
        },
        {
            "id": 149,
            "original_id": 149,
            "name": "Manchester United FC",
            "cleanName": "Manchester United",
            "english_name": "Manchester United FC",
            "shortHand": "manchester-united-fc",
            "country": "England",
            "continent": "",
            "image": "https://cdn.footystats.org/img/teams/england-manchester-united-fc.png",
            "flag_element": null,
            "season": "2018/2019",
            "seasonClean": null,
            "url": "https://footystats.org/clubs/england/manchester-united-fc",
            "stadium_name": "",
            "stadium_address": "",
            "table_position": 6,
            "performance_rank": 6,
            "risk": 76,
            "season_format": "Domestic League",
            "competition_id": 1625,
            "founded": "1878",
            "full_name": "Manchester United FC",
            "alt_names": [
                "Man Utd"
            ],
            "official_sites": []
        },
        {
            "id": 151,
            "original_id": 151,
            "name": "Liverpool FC",
            "cleanName": "Liverpool",
            "english_name": "Liverpool FC",
            "shortHand": "liverpool-fc",
            "country": "England",
            "continent": "",
            "image": "https://cdn.footystats.org/img/teams/england-liverpool-fc.png",
            "flag_element": null,
            "season": "2018/2019",
            "seasonClean": null,
            "url": "https://footystats.org/clubs/england/liverpool-fc",
            "stadium_name": "",
            "stadium_address": "",
            "table_position": 2,
            "performance_rank": 2,
            "risk": 63,
            "season_format": "Domestic League",
            "competition_id": 1625,
            "founded": "1892",
            "full_name": "Liverpool FC",
            "alt_names": [],
            "official_sites": []
        },
        {
            "id": 152,
            "original_id": 152,
            "name": "Chelsea FC",
            "cleanName": "Chelsea",
            "english_name": "Chelsea FC",
            "shortHand": "chelsea-fc",
            "country": "England",
            "continent": "",
            "image": "https://cdn.footystats.org/img/teams/england-chelsea-fc.png",
            "flag_element": null,
            "season": "2018/2019",
            "seasonClean": null,
            "url": "https://footystats.org/clubs/england/chelsea-fc",
            "stadium_name": "",
            "stadium_address": "",
            "table_position": 3,
            "performance_rank": 3,
            "risk": 66,
            "season_format": "Domestic League",
            "competition_id": 1625,
            "founded": "1905",
            "full_name": "Chelsea FC",
            "alt_names": [],
            "official_sites": []
        },
        {
            "id": 153,
            "original_id": 153,
            "name": "West Ham United FC",
            "cleanName": "West Ham United",
            "english_name": "West Ham United FC",
            "shortHand": "west-ham-united-fc",
            "country": "England",
            "continent": "",
            "image": "https://cdn.footystats.org/img/teams/england-west-ham-united-fc.png",
            "flag_element": null,
            "season": "2018/2019",
            "seasonClean": null,
            "url": "https://footystats.org/clubs/england/west-ham-united-fc",
            "stadium_name": "",
            "stadium_address": "",
            "table_position": 10,
            "performance_rank": 10,
            "risk": 63,
            "season_format": "Domestic League",
            "competition_id": 1625,
            "founded": "1895",
            "full_name": "West Ham United FC",
            "alt_names": [],
            "official_sites": []
        },
        {
            "id": 155,
            "original_id": 155,
            "name": "Watford FC",
            "cleanName": "Watford",
            "english_name": "Watford FC",
            "shortHand": "watford-fc",
            "country": "England",
            "continent": "",
            "image": "https://cdn.footystats.org/img/teams/england-watford-fc.png",
            "flag_element": null,
            "season": "2018/2019",
            "seasonClean": null,
            "url": "https://footystats.org/clubs/england/watford-fc",
            "stadium_name": "",
            "stadium_address": "",
            "table_position": 11,
            "performance_rank": 11,
            "risk": 100,
            "season_format": "Domestic League",
            "competition_id": 1625,
            "founded": "1881",
            "full_name": "Watford FC",
            "alt_names": [],
            "official_sites": []
        },
        {
            "id": 157,
            "original_id": 157,
            "name": "Newcastle United FC",
            "cleanName": "Newcastle United",
            "english_name": "Newcastle United FC",
            "shortHand": "newcastle-united-fc",
            "country": "England",
            "continent": "",
            "image": "https://cdn.footystats.org/img/teams/england-newcastle-united-fc.png",
            "flag_element": null,
            "season": "2018/2019",
            "seasonClean": null,
            "url": "https://footystats.org/clubs/england/newcastle-united-fc",
            "stadium_name": "",
            "stadium_address": "",
            "table_position": 13,
            "performance_rank": 13,
            "risk": 66,
            "season_format": "Domestic League",
            "competition_id": 1625,
            "founded": "1892",
            "full_name": "Newcastle United FC",
            "alt_names": [],
            "official_sites": []
        },
        {
            "id": 161,
            "original_id": 161,
            "name": "Cardiff City FC",
            "cleanName": "Cardiff City",
            "english_name": "Cardiff City FC",
            "shortHand": "cardiff-city-fc",
            "country": "Wales",
            "continent": "",
            "image": "https://cdn.footystats.org/img/teams/wales-cardiff-city-fc.png",
            "flag_element": null,
            "season": "2018/2019",
            "seasonClean": null,
            "url": "https://footystats.org/clubs/wales/cardiff-city-fc",
            "stadium_name": "",
            "stadium_address": "",
            "table_position": 18,
            "performance_rank": 18,
            "risk": 66,
            "season_format": "Domestic League",
            "competition_id": 1625,
            "founded": "1889",
            "full_name": "Cardiff City FC",
            "alt_names": [],
            "official_sites": []
        },
        {
            "id": 162,
            "original_id": 162,
            "name": "Fulham FC",
            "cleanName": "Fulham",
            "english_name": "Fulham FC",
            "shortHand": "fulham-fc",
            "country": "England",
            "continent": "",
            "image": "https://cdn.footystats.org/img/teams/england-fulham-fc.png",
            "flag_element": null,
            "season": "2018/2019",
            "seasonClean": null,
            "url": "https://footystats.org/clubs/england/fulham-fc",
            "stadium_name": "",
            "stadium_address": "",
            "table_position": 19,
            "performance_rank": 19,
            "risk": 74,
            "season_format": "Domestic League",
            "competition_id": 1625,
            "founded": "1879",
            "full_name": "Fulham FC",
            "alt_names": [],
            "official_sites": []
        },
        {
            "id": 209,
            "original_id": 209,
            "name": "Brighton & Hove Albion FC",
            "cleanName": "Brighton & Hove Albion",
            "english_name": "Brighton Hove Albion FC",
            "shortHand": "brighton-hove-albion-fc",
            "country": "England",
            "continent": "",
            "image": "https://cdn.footystats.org/img/teams/england-brighton-hove-albion-fc.png",
            "flag_element": null,
            "season": "2018/2019",
            "seasonClean": null,
            "url": "https://footystats.org/clubs/england/brighton-hove-albion-fc",
            "stadium_name": "",
            "stadium_address": "",
            "table_position": 17,
            "performance_rank": 17,
            "risk": 63,
            "season_format": "Domestic League",
            "competition_id": 1625,
            "founded": "1901",
            "full_name": "Brighton & Hove Albion FC",
            "alt_names": [
                "Brighton"
            ],
            "official_sites": {
                "Brighton & Hove Albion Official": "https://www.brightonandhovealbion.com/"
            }
        },
        {
            "id": 217,
            "original_id": 217,
            "name": "Huddersfield Town FC",
            "cleanName": "Huddersfield Town",
            "english_name": "Huddersfield Town FC",
            "shortHand": "huddersfield-town-fc",
            "country": "England",
            "continent": "",
            "image": "https://cdn.footystats.org/img/teams/england-huddersfield-town-fc.png",
            "flag_element": null,
            "season": "2018/2019",
            "seasonClean": null,
            "url": "https://footystats.org/clubs/england/huddersfield-town-fc",
            "stadium_name": "",
            "stadium_address": "",
            "table_position": 20,
            "performance_rank": 20,
            "risk": 58,
            "season_format": "Domestic League",
            "competition_id": 1625,
            "founded": "1908",
            "full_name": "Huddersfield Town FC",
            "alt_names": [],
            "official_sites": []
        },
        {
            "id": 223,
            "original_id": 223,
            "name": "Wolverhampton Wanderers FC",
            "cleanName": "Wolverhampton Wanderers",
            "english_name": "Wolverhampton Wanderers FC",
            "shortHand": "wolverhampton-wanderers-fc",
            "country": "England",
            "continent": "",
            "image": "https://cdn.footystats.org/img/teams/england-wolverhampton-wanderers-fc.png",
            "flag_element": null,
            "season": "2018/2019",
            "seasonClean": null,
            "url": "https://footystats.org/clubs/england/wolverhampton-wanderers-fc",
            "stadium_name": "",
            "stadium_address": "",
            "table_position": 7,
            "performance_rank": 7,
            "risk": 58,
            "season_format": "Domestic League",
            "competition_id": 1625,
            "founded": "1877",
            "full_name": "Wolverhampton Wanderers FC",
            "alt_names": [
                "Wolves"
            ],
            "official_sites": []
        }
    ]
}
Queries and Parameters
You can test this API call by using the key "example" and loading the matches from the English Premier League 2018/2019 season (ID: 1625).

Variable Name
Description
id
ID of the Team.
name / full_name / english_name
Name of the Team.
country
Country of the Team.
stats
Contains an array of Stats for the corresponding team.
competition_id
ID of the Competition in which the team is playing.
url
Corresponding FootyStats url.
founded
Foundation year of the team.
season
Latest season participating in.
table_position
Position in the league.
performance_rank
PPG rating within the league.
season_format
Format of the season.
official_sites
Official website url of the team.
risk
Prediction risk, it represents how often a team scores or concedes goals within close proximity of each other.
suspended_matches
Number of matches suspended.
homeOverallAdvantage / homeDefenceAdvantage / homeAttackAdvantage
Advantage this team has in attack.
Overall = all games, home = home games only, away = away games only.
seasonGoals_overall
Number of goals scored this season.
seasonConceded_overall
Number of goals conceded this season.
seasonGoalsTotal_overall / home / away
Number of goal event recorded when playing Home or Away.
Overall = all games, home = home games only, away = away games only.
seasonConcededNum_home / seasonConcededNum_away
Number of goals conceded this season.
Home = home games only, away = away games only.
seasonGoalsMin_overall / home / away
Average goals per minutes.
Overall = all games, home = home games only, away = away games only.
seasonConcededMin_overall / home / away
Average goals conceded per minutes.
Overall = all games, home = home games only, away = away games only.
seasonGoalDifference_overall / home / away
Goal difference.
Overall = all games, home = home games only, away = away games only.
seasonWinsNum_overall / home / away
Number of wins in the season.
Overall = all games, home = home games only, away = away games only.
seasonDrawsNum_overall / home / away
Number of draws in the season.
Overall = all games, home = home games only, away = away games only.
seasonLossesNum_overall / home / away
Number of losses in the season.
Overall = all games, home = home games only, away = away games only.
seasonMatchesPlayed_overall / home / away
Number of match played in the season.
Overall = all games, home = home games only, away = away games only.
seasonHighestScored_home / seasonHighestScored_away
Season's highest number of goals scored.
Home = home games only, away = away games only.
seasonHighestConceded_home / seasonHighestConceded_away
Season's highest number of goals conceded.
Home = home games only, away = away games only.
seasonCS_overall / home / away
Season's clean sheets.
Overall = all games, home = home games only, away = away games only.
seasonCSPercentage_overall / home / away
Season's clean sheets percentage.
Overall = all games, home = home games only, away = away games only.
seasonCSHT_overall / home / away
Season's clean sheets at half-time.
Overall = all games, home = home games only, away = away games only.
seasonCSPercentageHT_overall / home / away
Season's clean sheets percentage at half-time.
Overall = all games, home = home games only, away = away games only.
seasonFTS_overall / home / away
Season's Failed To Score.
Overall = all games, home = home games only, away = away games only.
seasonFTSPercentage_overall / home / away
Season's Failed To Score percentage.
Overall = all games, home = home games only, away = away games only.
seasonFTSHT_overall / home / away
Season's Failed to score at half-time.
Overall = all games, home = home games only, away = away games only.
seasonFTSPercentageHT_overall / home / away
Season's Failed to score at half-time percentage.
Overall = all games, home = home games only, away = away games only.
seasonBTTS_overall / home / away
Season's both teams to score.
Overall = all games, home = home games only, away = away games only.
seasonBTTSPercentage_overall / home / away
Season's both teams to score percentage.
Overall = all games, home = home games only, away = away games only.
seasonBTTSHT_overall / home / away
Season's both teams to score at half-time.
Overall = all games, home = home games only, away = away games only.
seasonBTTSPercentageHT_overall / home / away
Season's both teams to score at half-time percentage.
Overall = all games, home = home games only, away = away games only.
seasonPPG_overall / home / away
Season's points per game, Win = 3 points, Draw = 1 point.
Overall = all games, home = home games only, away = away games only.
seasonAVG_overall / home / away
Season's average goals scored + conceded per game.
Overall = all games, home = home games only, away = away games only.
seasonScoredAVG_overall / home / away
Season's average goals scored per game.
Overall = all games, home = home games only, away = away games only.
seasonConcededAVG_overall / home / away
Season's average goals conceded per game.
Overall = all games, home = home games only, away = away games only.
winPercentage_overall / home / away
Season's average win percentage.
Overall = all games, home = home games only, away = away games only.
drawPercentage_overall / home / away
Season's average draw percentage.
Overall = all games, home = home games only, away = away games only.
losePercentage_overall / home / away
Season's average loss percentage.
Overall = all games, home = home games only, away = away games only.
leadingAtHT_overall / home / away
Season's leading at half-time count.
Overall = all games, home = home games only, away = away games only.
leadingAtHTPercentage_overall / home / away
Season's leading at half-time percentage.
Overall = all games, home = home games only, away = away games only.
drawingAtHT_overall / home / away
Season's drawing at half-time.
Overall = all games, home = home games only, away = away games only.
drawingAtHTPercentage_overall / home / away
Season's drawing at half-time percentage.
Overall = all games, home = home games only, away = away games only.
trailingAtHT_overall / home / away
Season's losing at half-time.
Overall = all games, home = home games only, away = away games only.
trailingAtHTPercentage_overall / home / away
Season's losing at half-time percentage.
Overall = all games, home = home games only, away = away games only.
HTPoints_overall / home / away
Season's half-time points.
Overall = all games, home = home games only, away = away games only.
HTPPG_overall / home / away
Season's half-time points per game.
Overall = all games, home = home games only, away = away games only.
scoredAVGHT_overall / home / away
Season's average scored at half-time.
Overall = all games, home = home games only, away = away games only.
concededAVGHT_overall / home / away
Season's average conceded at half-time.
Overall = all games, home = home games only, away = away games only.
AVGHT_overall / home / away
Season's average scored + conceded at half-time.
Overall = all games, home = home games only, away = away games only.
GoalsHT_overall / home / away
Season's average goals at half-time.
Overall = all games, home = home games only, away = away games only.
GoalDifferenceHT_overall / home / away
Season's average goal difference at half-time.
Overall = all games, home = home games only, away = away games only.
seasonOver05Num_overall - seasonOver55Num_overall / home / away
Season's count of Over (0.5 - 5.5) goals.
Overall = all games, home = home games only, away = away games only.
seasonOver05Percentage_overall - seasonOver55Percentage_overall / home / away
Season's percentage of Over (0.5 - 5.5) goals.
Overall = all games, home = home games only, away = away games only.
seasonUnder05Num_overall - seasonUnder55Num_overall / home / away
Season's count of Under (0.5 - 5.5) goals.
Overall = all games, home = home games only, away = away games only.
seasonUnder05Percentage_overall - seasonUnder55Percentage_overall / home / away
Season's percentage of Under (0.5 - 5.5) goals.
Overall = all games, home = home games only, away = away games only.
seasonOver05NumHT_overall - seasonOver25NumHT_overall / home / away
Season's count of Over (0.5 - 5.5) goals at half time.
Overall = all games, home = home games only, away = away games only.
seasonOver05PercentageHT_overall - seasonOver25PercentageHT_overall / home / away
Season's percentage of Over (0.5 - 5.5) goals at half time.
Overall = all games, home = home games only, away = away games only.
cornersRecorded_matches_overall / home / away
Season's corners recorded per matches.
Overall = all games, home = home games only, away = away games only.
over65Corners_overall - over135Corners_overall / home / away
Season's count of Over (6.5 - 13.5) corners.
Overall = all games, home = home games only, away = away games only.
over65CornersPercentage_overall - over135CornersPercentage_overall / home / away
Season's percentage of Over (6.5 - 13.5) corners.
Overall = all games, home = home games only, away = away games only.
over25CornersFor_overall - over85CornersFor_overall / home / away
Season's count of Over (2.5 - 8.5) corners for.
Overall = all games, home = home games only, away = away games only.
over25CornersForPercentage_overall - over65CornersForPercentage_overall / home / away
Season's percentage of Over (2.5 - 8.5) corners for.
Overall = all games, home = home games only, away = away games only.
over25CornersAgainst_overall - over85CornersAgainst_overall / home / away
Season's count of Over (2.5 - 8.5) corners against.
Overall = all games, home = home games only, away = away games only.
over25CornersAgainstPercentage_overall - over65CornersAgainstPercentage_overall / home / away
Season's percentage of Over (2.5 - 8.5) corners against.
Overall = all games, home = home games only, away = away games only.
over05Cards_overall - over85Cards_overall / ohome / away
Season's count of Over (0,5 - 8.5) cards.
Overall = all games, home = home games only, away = away games only.
over05CardsPercentage_overall - over85CardsPercentage_overall / home / away
Season's percentage of Over (0,5 - 8.5) cards.
Overall = all games, home = home games only, away = away games only.
over05CardsFor_overall - over85CardsFor_overall / home / away
Season's count of Over (0,5 - 8.5) cards for.
Overall = all games, home = home games only, away = away games only.
over05CardsForPercentage_overall - over85CardsForPercentage_overall / home / away
Season's percentage of Over (0,5 - 8.5) cards for.
Overall = all games, home = home games only, away = away games only.
over05CardsAgainst_overall - over85CardsAgainst_overall / home / away
Season's count of Over (0,5 - 8.5) cards for.
Overall = all games, home = home games only, away = away games only.
over05CardsAgainstPercentage_overall - over85CardsAgainstPercentage_overall / home / away
Season's percentage of Over (0,5 - 8.5) cards for.
Overall = all games, home = home games only, away = away games only.
leaguePosition_overall / home / away
Season's league position.
Overall = normal league table, home = home table only, away = away table only.
firstGoalScored_overall / home / away
Season's count of first goals scored.
Overall = all games, home = home games only, away = away games only.
firstGoalScoredPercentage_overall / home / away
Season's percentage of first goals scored.
Overall = all games, home = home games only, away = away games only.
cornersTotal_overall / home / away
Season's count of corners.
Overall = all games, home = home games only, away = away games only.
cornersTotalAVG_overall / home / away
Season's total average count of corners per match.
Overall = all games, home = home games only, away = away games only.
cornersAVG_overall / home / away
Season's average count of corners.
Overall = all games, home = home games only, away = away games only.
cardsTotal_overall / home / away
Season's count of cards.
Overall = all games, home = home games only, away = away games only.
cardsAVG_overall / home / away
Season's average cards.
Overall = all games, home = home games only, away = away games only.
cornersHighest_overall / cornersLowest_overall
Season's Highest / Lowest corners counts.
cornersAgainst_overall / home / away
Season's corners against.
Overall = all games, home = home games only, away = away games only.
cornersAgainstAVG_overall / home / away
Season's average corners against.
Overall = all games, home = home games only, away = away games only.
shotsTotal_overall / home / away
Season's shots.
Overall = all games, home = home games only, away = away games only.
shotsAVG_overall / home / away
Season's shots.
Overall = all games, home = home games only, away = away games only.
shotsOnTargetTotal_overall / home / away
Season's shots on target.
Overall = all games, home = home games only, away = away games only.
shotsOffTargetTotal_overall / home / away
Season's shots off target.
Overall = all games, home = home games only, away = away games only.
shotsOnTargetAVG_overall / home / away
Season's shots on target average.
Overall = all games, home = home games only, away = away games only.
shotsOffTargetAVG_overall / home / away
Season's shots off target average.
Overall = all games, home = home games only, away = away games only.
possessionAVG_overall / home / away
Season's possession average.
Overall = all games, home = home games only, away = away games only.
foulsAVG_overall / home / away
Season's fouls average.
Overall = all games, home = home games only, away = away games only.
foulsTotal_overall / fhome / away
Season's total fouls.
Overall = all games, home = home games only, away = away games only.
offsidesTotal_overall / home / away
Season's total offsides.
Overall = all games, home = home games only, away = away games only.
offsidesTeamTotal_overall / home / away
Season's total team offsides.
Overall = all games, home = home games only, away = away games only.
offsidesRecorded_matches_overall / home / away
Season's offsides recorded per match.
Overall = all games, home = home games only, away = away games only.
offsidesAVG_overall / home / away
Season's average offsides.
Overall = all games, home = home games only, away = away games only.
offsidesTeamAVG_overall / home / away
Season's team average offsides.
Overall = all games, home = home games only, away = away games only.
offsidesOver05_overall - offsidesOver65_overall / home / away
Season's count of Over (0,5 - 6.5) offsides.
Overall = all games, home = home games only, away = away games only.
over05OffsidesPercentage_overall - over65OffsidesPercentage_overall / home / away
Season's percentage of Over (0,5 - 6.5) offsides.
Overall = all games, home = home games only, away = away games only.
offsidesTeamOver05_overall - offsidesTeamOver65_overall / home / away
Season's count of Over (0,5 - 6.5) Team offsides.
Overall = all games, home = home games only, away = away games only.
over05OffsidesTeamPercentage_overall - over65OffsidesTeamPercentage_overall / home / away
Season's percentage of Over (0,5 - 6.5) Team offsides.
Overall = all games, home = home games only, away = away games only.
scoredBothHalves_overall / home / away
Season's scored in both halves.
Overall = all games, home = home games only, away = away games only.
scoredBothHalvesPercentage_overall / home / away
Season's scored in both halves percentage.
Overall = all games, home = home games only, away = away games only.
seasonMatchesPlayedGoalTimingRecorded_overall / home / away
Season's matches played goal timing recorded.
Overall = all games, home = home games only, away = away games only.
BTTS_and_win_overall / home / away
Season's both teams to score and win count.
Overall = all games, home = home games only, away = away games only.
BTTS_and_win_percentage_overall / home / away
Season's both teams to score and win percentagev.
Overall = all games, home = home games only, away = away games only.
BTTS_and_draw_overall / home / away
Season's both teams to score and draw count.
Overall = all games, home = home games only, away = away games only.
BTTS_and_draw_percentage_overall / home / away
Season's both teams to score and draw percentage.
Overall = all games, home = home games only, away = away games only.
BTTS_and_lose_overall / home / away
Season's both teams to score and lose count.
Overall = all games, home = home games only, away = away games only.
BTTS_and_lose_percentage_overall / home / away
Season's both teams to score and lose percentage.
Overall = all games, home = home games only, away = away games only.
AVG_2hg_overall / home / away
Average second half total goals.
Overall = all games, home = home games only, away = away games only.
scored_2hg_avg_overall / home / away
Average second half goals scored.
Overall = all games, home = home games only, away = away games only.
conceded_2hg_avg_overall / home / away
Average second half goals conceded.
Overall = all games, home = home games only, away = away games only.
total_2hg_overall / home / away
Total second half total goals.
Overall = all games, home = home games only, away = away games only.
conceded_2hg_overall / home / away
Total second half goals conceded.
Overall = all games, home = home games only, away = away games only.
scored_2hg_overall / home / away
Total second half goals scored.
Overall = all games, home = home games only, away = away games only.
over05_2hg_num_overall - over25_2hg_num_overall / home / away
Season's count of Over (0,5 - 2.5) second half goals.
Overall = all games, home = home games only, away = away games only.
over05_2hg_percentage_overall - over25_2hg_percentage_overall / home / away
Season's percentage of Over (0,5 - 2.5) second half goals.
Overall = all games, home = home games only, away = away games only.
points_2hg_overall / home / away
Season's points gained in second half.
Overall = all games, home = home games only, away = away games only.
ppg_2hg_overall / home / away
Season's point per game in second half.
Overall = all games, home = home games only, away = away games only.
wins_2hg_overall / home / away
Season's wins in second half.
Overall = all games, home = home games only, away = away games only.
wins_2hg_percentage_overall / home / away
Season's wins percentage in second half.
Overall = all games, home = home games only, away = away games only.
draws_2hg_overall / home / away
Season's draws in second half.
Overall = all games, home = home games only, away = away games only.
draws_2hg_percentage_overall / home / away
Season's draws percentage in second half.
Overall = all games, home = home games only, away = away games only.
losses_2hg_overall / home / away
Season's loses in second half.
Overall = all games, home = home games only, away = away games only.
losses_2hg_percentage_overall / home / away
Season's losses percentage in second half.
Overall = all games, home = home games only, away = away games only.
gd_2hg_overall / home / away
Season's goal difference in second half.
Overall = all games, home = home games only, away = away games only.
btts_2hg_overall / home / away
Season's both teams to score in second half.
Overall = all games, home = home games only, away = away games only.
btts_2hg_percentage_overall / home / away
Season's percentage of both teams to score in second half.
Overall = all games, home = home games only, away = away games only.
btts_fhg_overall / home / away
Season's both teams to score in first half.
Overall = all games, home = home games only, away = away games only.
btts_fhg_percentage_overall / home / away
Season's percentage of both teams to score in first half.
Overall = all games, home = home games only, away = away games only.
cs_2hg_overall / home / away
Season's clean sheets in second half.
Overall = all games, home = home games only, away = away games only.
cs_2hg_percentage_overall / home / away
Season's clean sheets percentage in second half.
Overall = all games, home = home games only, away = away games only.
fts_2hg_overall / home / away
Season's first to score in second half.
Overall = all games, home = home games only, away = away games only.
fts_2hg_percentage_overall / home / away
Season's first to score percentage in second half.
Overall = all games, home = home games only, away = away games only.
BTTS_both_halves_overall / home / away
Season's both teams to score in both halves.
Overall = all games, home = home games only, away = away games only.
BTTS_both_halves_percentage_overall / home / away
Season's both teams to score percentage in both halves.
Overall = all games, home = home games only, away = away games only.
average_attendance_overall / home / away
Season's average attendance.
Overall = all games, home = home games only, away = away games only.
cornerTimingRecorded_matches_overall / home / away
Timing of the corners recorded.
Overall = all games, home = home games only, away = away games only.
corners_fh_overall / home / away
Season's first half corners.
Overall = all games, home = home games only, away = away games only.
corners_2h_overall / home / away
Season's second half corners.
Overall = all games, home = home games only, away = away games only.
corners_fh_avg_overall / home / away
Season's first half corners.
Overall = all games, home = home games only, away = away games only.
corners_fh_over4_overall - corners_fh_over6_overall / home / away
Season's Over (4 - 6) first half corners.
Overall = all games, home = home games only, away = away games only.
corners_2h_over4_overall - corners_2h_over6_overall / home / away
Season's Over (4 - 6) second half corners.
Overall = all games, home = home games only, away = away games only.
corners_fh_over4_percentage_overall - corners_fh_over6_percentage_overall / home / away
Season's Over (4 - 6) first half corners.
Overall = all games, home = home games only, away = away games only.
corners_2h_over4_percentage_overall - corners_2h_over6_percentage_overall / home / away
Season's Over (4 - 6) second half corners.
Overall = all games, home = home games only, away = away games only.
attack_num_recoded_matches_overall / home / away
Season's count of attacks recorded per match.
Overall = all games, home = home games only, away = away games only.
dangerous_attacks_avg_overall / home / away
Season's count of dangerous attacks recorder per match.
Overall = all games, home = home games only, away = away games only.
xg_for_overall / home / away
Season's Xg for .
Overall = all games, home = home games only, away = away games only.
xg_for_avg_overall / home / away
Season's average xg for.
Overall = all games, home = home games only, away = away games only.
xg_against_avg_overall / home / away
Season's average xg against.
Overall = all games, home = home games only, away = away games only.
attacks_num_overall / home / away
Number of attacks.
Overall = all games, home = home games only, away = away games only.
seasonScoredOver05Num_overall - seasonScoredOver35Num_overall / home / away
Season's Over (0.5 - 3.5) scored.
Overall = all games, home = home games only, away = away games only.
seasonScoredOver05PercentageNum_overall - seasonScoredOver35PercentageNum_overall / home / away
Season's percentage of Over (0.5 - 3.5) scored.
Overall = all games, home = home games only, away = away games only.
seasonConcededOver05Num_overall - seasonConcededOver35Num_overall / home / away
Season's Over (0.5 - 3.5) Conceded.
Overall = all games, home = home games only, away = away games only.
seasonConcededOver05PercentageNum_overall - seasonConcededOver35PercentageNum_overall / home / away
Season's percentage of Over (0.5 - 3.5) Conceded.
Overall = all games, home = home games only, away = away games only.
cardTimingRecorded_matches_overall / home / away
cards timing recorded in match.
Overall = all games, home = home games only, away = away games only.
cardsRecorded_matches_overall / home / away
cards recorded in match.
Overall = all games, home = home games only, away = away games only.
fh_cards_total_overall / home / away
first half cards.
Overall = all games, home = home games only, away = away games only.
2h_cards_total_overall / home / away
Total second half cards.
Overall = all games, home = home games only, away = away games only.
fh_cards_for_total_overall / home / away
Total first half cards for.
Overall = all games, home = home games only, away = away games only.
2h_cards_for_total_overall / home / away
Total second half cards for.
Overall = all games, home = home games only, away = away games only.
fh_cards_against_total_overall / home / away
Total first half cards against.
Overall = all games, home = home games only, away = away games only.
2h_cards_against_total_overall / home / away
Total second half cards against total.
Overall = all games, home = home games only, away = away games only.
fh_total_cards_under2_percentage_overall / home / away
First half total cards under 2 percentage.
Overall = all games, home = home games only, away = away games only.
2h_total_cards_under2_percentage_overall / home / away
Second half total cards under 2 percentage.
Overall = all games, home = home games only, away = away games only.
fh_total_cards_2to3_percentage_overall / home / away
First half total cards 2 to 3 percentage.
Overall = all games, home = home games only, away = away games only.
2h_total_cards_2to3_percentage_overall / home / away
Second half total cards 2 to 3 percentage.
Overall = all games, home = home games only, away = away games only.
fh_total_cards_over3_percentage_overall / fhome / away
First half total cards over 3 percentage.
Overall = all games, home = home games only, away = away games only.
2h_total_cards_over3_percentage_overall / home / away
Second half total cards over 3 percentage.
Overall = all games, home = home games only, away = away games only.
fh_half_with_most_cards_total_percentage_overall / home / away
First half with most cards total percentage.
Overall = all games, home = home games only, away = away games only.
2h_half_with_most_cards_total_percentage_overall / home / away
Second half with most cards total percentage.
Overall = all games, home = home games only, away = away games only.
fh_cards_for_over05_percentage_overall / home / away
First half cards for the team, Over 0.5.
Overall = all games, home = home games only, away = away games only.
2h_cards_for_over05_percentage_overall / home / away
Second half cards for the team, Over 0.5.
Overall = all games, home = home games only, away = away games only.
cards_for_overall / home / away
Cards for.
Overall = all games, home = home games only, away = away games only.
cards_against_overall / home / away
Cards against.
Overall = all games, home = home games only, away = away games only.
cards_for_avg_overall / home / away
Average cards for.
Overall = all games, home = home games only, away = away games only.
cards_against_avg_overall / home / away
Average cards against.
Overall = all games, home = home games only, away = away games only.
cards_total_overall / home / away
Total cards.
Overall = all games, home = home games only, away = away games only.
cards_total_avg_overall / home / away
Average total cards.
Overall = all games, home = home games only, away = away games only.
penalties_won_overall / home / away
Penatlies won.
Overall = all games, home = home games only, away = away games only.
penalties_scored_overall / home / away
Penatlies scored.
Overall = all games, home = home games only, away = away games only.
penalties_missed_overall / home / away
Penalties missed.
Overall = all games, home = home games only, away = away games only.
penalties_won_per_match_overall / home / away
Penalties won per match.
Overall = all games, home = home games only, away = away games only.
penalties_recorded_matches_overall / home / away
Penalties recorded per match.
Overall = all games, home = home games only, away = away games only.
exact_team_goals_0_ft_overall - exact_team_goals_3_ft_overall / home / away
Number of times the team scored exactly (0 - 3) goals at full time.
Overall = all games, home = home games only, away = away games only.
match_shots_over225_num_overall - match_shots_over265_num_overall / home / away
Count of match shots Over (22.5 - 26.5).
Overall = all games, home = home games only, away = away games only.
match_shots_over225_percentage_overall - match_shots_over265_percentage_overall / home / away
Percentage of match shots Over (22.5 - 26.5).
Overall = all games, home = home games only, away = away games only.
match_shots_on_target_over75_num_overall - match_shots_on_target_over95_num_overall / home / away
Number of match shots Over (7.5 - 9.5).
Overall = all games, home = home games only, away = away games only.
match_shots_on_target_over75_percentage_overall - match_shots_on_target_over95_percentage_overall / home / away
Percentage of match shots Over (7.5 - 9.5).
Overall = all games, home = home games only, away = away games only.
team_shots_over105_num_overall - team_shots_over155_num_overall / home / away
Number of team shots Over (10.5 - 15.5).
Overall = all games, home = home games only, away = away games only.
team_shots_over105_percentage_overall - team_shots_over155_percentage_overall / home / away
Percentage of team shots Over (10.5 - 15.5).
Overall = all games, home = home games only, away = away games only.
team_shots_on_target_over35_num_overall - team_shots_on_target_over65_num_overall / home / away
Number of team shots on target Over (3.5 - 6.5).
Overall = all games, home = home games only, away = away games only.
team_shots_on_target_over35_percentage_overall - team_shots_on_target_over65_percentage_overall / home / away
Percentage of team shots on target Over (3.5 - 6.5).
Overall = all games, home = home games only, away = away games only.
win_0_10_num_overall / home / away
Win count between minute 0 and 10, this parameter does not inherit the score of the game and focuses only on the first 0 to 10 minutes.
Overall = all games, home = home games only, away = away games only.
draw_0_10_num_overall / home / away
Draw count between minute 0 and 10, this parameter does not inherit the score of the game and focuses only on the first 0 to 10 minutes.
Overall = all games, home = home games only, away = away games only.
loss_0_10_num_overall / home / away
Loss count between minute 0 and 10, this parameter does not inherit the score of the game and focuses only on the first 0 to 10 minutes.
Overall = all games, home = home games only, away = away games only.
win_0_10_percentage_overall / home / away
Win percentage between minute 0 and 10, this parameter does not inherit the score of the game and focuses only on the first 0 to 10 minutes.
Overall = all games, home = home games only, away = away games only.
draw_0_10_percentage_overall / home / away
Draw percentage between minute 0 and 10, this parameter does not inherit the score of the game and focuses only on the first 0 to 10 minutes.
Overall = all games, home = home games only, away = away games only.
loss_0_10_percentage_overall / home / away
Loss percentage between minute 0 and 10, this parameter does not inherit the score of the game and focuses only on the first 0 to 10 minutes.
Overall = all games, home = home games only, away = away games only.
total_goal_over05_0_10_num_overall / home / away
Count of over 0.5 goals between minute 0 and 10.
Overall = all games, home = home games only, away = away games only.
total_corner_over05_0_10_num_overall / home / away
Count of over 0.5 corners between minute 0 and 10.
Overall = all games, home = home games only, away = away games only.
total_goal_over05_0_10_percentage_overall / home / away
Percentage of over 0.5 goals between minute 0 and 10.
Overall = all games, home = home games only, away = away games only.
total_corner_over05_0_10_percentage_overall / home / away
Percentage of over 0.5 corners between minute 0 and 10.
Overall = all games, home = home games only, away = away games only.
fouls_recorded_overall / home / away
Fouls recorded.
Overall = all games, home = home games only, away = away games only.
fouls_against_num_overall / home / away
Fouls against recorded.
Overall = all games, home = home games only, away = away games only.
fouls_against_avg_overall / home / away
Average fouls against recorded.
Overall = all games, home = home games only, away = away games only.
exact_team_goals_0_ft_percentage_overall - exact_team_goals_3_ft_percentage_overall / home / away
Percentage of (0 - 3) exact team goals.
Overall = all games, home = home games only, away = away games only.
exact_total_goals_0_ft_overall - exact_total_goals_7_ft_overall / home / away
Count of (0 - 7) exact team goals.
Overall = all games, home = home games only, away = away games only.
shots_recorded_matches_num_overall / home / away
Number of shots recorded per matches.
Overall = all games, home = home games only, away = away games only.
over25_and_btts_num_overall / home / away
Count of over 2.5 and BTTS.
Overall = all games, home = home games only, away = away games only.
over25_and_no_btts_num_overall / home / away
Count of over 2.5 and NO BTTS.
Overall = all games, home = home games only, away = away games only.
over25_and_btts_percentage_overall / home / away
Percentage of over 2.5 and BTTS.
Overall = all games, home = home games only, away = away games only.
over25_and_no_btts_percentage_overall / home / away
Percentage of over 2.5 and NO BTTS.
Overall = all games, home = home games only, away = away games only.
btts_1h2h_yes_yes_num_overall / home / away
Count of BTTS first half yes & BTTS second half yes.
Overall = all games, home = home games only, away = away games only.
btts_1h2h_yes_no_num_overall / home / away
Count of BTTS first half yes & BTTS second half no.
Overall = all games, home = home games only, away = away games only.
btts_1h2h_no_no_num_overall / home / away
Count of BTTS first half no & BTTS second half no.
Overall = all games, home = home games only, away = away games only.
btts_1h2h_no_yes_num_overall / home / away
Count of BTTS first half no & BTTS second half yes.
Overall = all games, home = home games only, away = away games only.
btts_1h2h_yes_yes_percentage_overall / home / away
Percentage of BTTS first half yes & BTTS second half yes.
Overall = all games, home = home games only, away = away games only.
btts_1h2h_yes_no_percentage_overall / home / away
Percentage of BTTS first half yes & BTTS second half no.
Overall = all games, home = home games only, away = away games only.
btts_1h2h_no_no_percentage_overall / home / away
Percentage of BTTS first half no & BTTS second half no.
Overall = all games, home = home games only, away = away games only.
btts_1h2h_no_yes_percentage_overall / home / away
Percentage of BTTS first half no & BTTS second half yes.
Overall = all games, home = home games only, away = away games only.
half_with_most_goals_is_1h_num_overall / home / away
Number of times the half with most goals was the 1st half.
Overall = all games, home = home games only, away = away games only.
half_with_most_goals_is_tie_num_overall / home / away
Number of times the half with most goals was a tie between 1st and 2nd half.
Overall = all games, home = home games only, away = away games only.
half_with_most_goals_is_2h_num_overall / home / away
Number of times the half with most goals was the 2nd half.
Overall = all games, home = home games only, away = away games only.
half_with_most_goals_is_1h_percentage_overall / home / away
Percentage of times the half with most goals was the 1st half.
Overall = all games, home = home games only, away = away games only.
half_with_most_goals_is_tie_percentage_overall / home / away
Percentage of times the half with most goals was a tie between 1st and 2nd half.
Overall = all games, home = home games only, away = away games only.
half_with_most_goals_is_2h_percentage_overall / home / away
Percentage of times the half with most goals was the 2nd half.
Overall = all games, home = home games only, away = away games only.
shot_conversion_rate_overall / home / away
Shot conversion rate.
Overall = all games, home = home games only, away = away games only.
team_with_most_corners_win_num_overall / home / away
Number of times the team had the most corners.
Overall = all games, home = home games only, away = away games only.
team_with_most_corners_win_1h_num_overall / home / away
Number of times the team had the most corners in 1st half.
Overall = all games, home = home games only, away = away games only.
team_with_most_corners_win_2h_num_overall / home / away
Number of times the team had the most corners in 2nd half.
Overall = all games, home = home games only, away = away games only.
team_with_most_corners_win_percentage_overall / home / away
Percentage of times the team had the most corners in the match.
Overall = all games, home = home games only, away = away games only.
team_with_most_corners_win_1h_percentage_overall / home / away
Percentage of times the team had the most corners in 1st half.
Overall = all games, home = home games only, away = away games only.
team_with_most_corners_win_2h_percentage_overall / home / away
Percentage of times the team had the most corners in 2nd half.
Overall = all games, home = home games only, away = away games only.
corners_earned_1h_num_overall / home / away
Total number of 1st half corner kicks that this team earned this season in this competition.
Overall = all games, home = home games only, away = away games only.
corners_earned_2h_num_overall / home / away
Total number of 2nd half corner kicks that this team earned this season in this competition.
Overall = all games, home = home games only, away = away games only.
corners_earned_1h_avg_overall / home / away
Average number of 1st half corner kicks per match that this team earned this season in this competition. Average = total number divided number of matches.
Overall = all games, home = home games only, away = away games only.
corners_earned_2h_avg_overall / home / away
Average number of 2nd half corner kicks per match that this team earned this season in this competition. Average = total number divided number of matches.
Overall = all games, home = home games only, away = away games only.
corners_earned_1h_over2_num_overall / home / away
Number of times this team has earned more than 2 corner kicks in the 1st half this season.
Overall = all games, home = home games only, away = away games only.
corners_earned_2h_over2_num_overall / home / away
Number of times this team has earned more than 2 corner kicks in the 2nd half this season.
Overall = all games, home = home games only, away = away games only.
corners_earned_1h_over3_num_overall / home / away
Number of times this team has earned more than 3 corner kicks in the 1st half this season.
Overall = all games, home = home games only, away = away games only.
corners_earned_2h_over3_num_overall / home / away
Number of times this team has earned more than 3 corner kicks in the 2nd half this season.
Overall = all games, home = home games only, away = away games only.
corners_earned_1h_2_to_3_num_overall / home / away
Number of times this team has earned 2 or 3 corner kicks in the 1st half this season.
Overall = all games, home = home games only, away = away games only.
corners_earned_2h_2_to_3_num_overall / home / away
Number of times this team has earned 2 or 3 corner kicks in the 2nd half this season.
Overall = all games, home = home games only, away = away games only.
corners_earned_1h_over2_percentage_overall / home / away
Percentage of matches this team has earned more than 2 corner kicks in the 1st half this season.
Overall = all games, home = home games only, away = away games only. Percentage calculation = number of matches of Over 2 corners in 1st half divided by number of matches this team played where corner timings were recorded.
corners_earned_2h_over2_percentage_overall / home / away
Percentage of matches this team has earned more than 2 corner kicks in the 2nd half this season.
Overall = all games, home = home games only, away = away games only. Percentage calculation = number of matches of Over 2 corners in 2nd half divided by number of matches this team played where corner timings were recorded.
corners_earned_1h_over3_percentage_overall / home / away
Percentage of matches this team has earned more than 3 corner kicks in the 1st half this season.
Overall = all games, home = home games only, away = away games only. Percentage calculation = number of matches of Over 3 corners in 1st half divided by number of matches this team played where corner timings were recorded.
corners_earned_2h_over3_percentage_overall / home / away
Percentage of matches this team has earned more than 3 corner kicks in the 2nd half this season.
Overall = all games, home = home games only, away = away games only. Percentage calculation = number of matches of Over 3 corners in 2nd half divided by number of matches this team played where corner timings were recorded.
corners_earned_1h_2_to_3_percentage_overall / home / away
Percentage of matches this team has earned 2 or 3 corner kicks in the 1st half this season.
Overall = all games, home = home games only, away = away games only. Percentage calculation = number of matches of 2 to 3 corners in 1st half divided by number of matches this team played where corner timings were recorded.
corners_earned_2h_2_to_3_percentage_overall / home / away
Percentage of matches this team has earned 2 or 3 corner kicks in the 2nd half this season.
Overall = all games, home = home games only, away = away games only. Percentage calculation = number of matches of 2 to 3 corners in 2nd half divided by number of matches this team played where corner timings were recorded.
penalties_conceded_overall / home / away
Penalty kicks conceded by this team this season.
penalty_in_a_match_overall / home / away
Number of matches where there was at least 1 penalty kick by either team this season.
penalty_in_a_match_percentage_overall / home / away
Percentage of matches where there was at least 1 penalty kick by either team this season.
goal_kicks_recorded_matches_overall / home / away
Number of matches where goal kicks were recorded this season.
goal_kicks_team_num_overall / home / away
Number of goal kicks by this team this season.
goal_kicks_total_num_overall / home / away
Number of total goal kicks by both teams this season.
goal_kicks_team_avg_overall / home / away
Average number of goal kicks per match by this team this season.
goal_kicks_total_avg_overall / home / away
Average number of total goal kicks per match by both teams this season.
goal_kicks_team_over35_overall ~ goal_kicks_team_over115_overall / home / away
Number of matches where this team performed Over 3.5 ~ Over 11.5 goal kicks this season.
goal_kicks_total_over85_overall ~ goal_kicks_total_over185_overall / home / away
Number of matches where both teams in total performed Over 8.5 ~ Over 18.5 goal kicks this season.
throwins_recorded_matches_overall / home / away
Number of matches where throw-ins were recorded this season.
throwins_team_num_overall / home / away
Number of throw-ins by this team this season.
throwins_total_num_overall / home / away
Number of total throw-ins by both teams this season.
throwins_team_avg_overall / home / away
Average number of throw-ins per match by this teams this season.
throwins_total_avg_overall / home / away
Average number of total throw-ins per match by both teams this season.
throwins_team_over155_overall ~ throwins_team_over245_overall / home / away
Number of matches where this team performed Over 15.5 ~ Over 24.5 goal throw-ins this season.
goals_scored_min_0_to_10 - goals_scored_min_81_to_90
Number of goals scored during this time period. This season
goals_conceded_min_0_to_10 - goals_conceded_min_81_to_90
Number of goals conceded during this time period. This season
goals_all_min_0_to_10 - goals_all_min_81_to_90
Number of goals scored and conceded during this time period. This season. This is in 10 minute increments.
goals_all_min_0_to_15 - goals_all_min_76_to_90
Number of goals scored and conceded during this time period. This season. This is in 15 minute increments.
goals_scored_min_0_to_15 - goals_scored_min_76_to_90
Number of goals scored during this time period. This season. This is in 15 minute increments.
goals_conceded_min_0_to_15 - goals_conceded_min_76_to_90
Number of goals conceded during this time period. This season. This is in 15 minute increments.
goals_scored_min_0_to_10_home - goals_scored_min_81_to_90_home / goals_scored_min_0_to_10_away - goals_scored_min_81_to_90_away
Number of goals scored during this time period. This season at home games only or away games only.
goals_scored_min_0_to_15_home - goals_scored_min_76_to_90_home / goals_scored_min_0_to_15_away - goals_scored_min_76_to_90_away
Number of goals scored during this time period. This season at home games only or away games only. This is in 15 minute increments.
goals_conceded_min_0_to_10_home - goals_conceded_min_81_to_90_home / goals_conceded_min_0_to_10_away - goals_conceded_min_81_to_90_away
Number of goals conceded during this time period. This season at home games only or at away games only.
goals_conceded_min_0_to_15_home - goals_conceded_min_76_to_90_home / goals_conceded_min_0_to_15_away - goals_conceded_min_76_to_90_away
Number of goals scored during this time period. This season at home games only or away games only. This is in 15 minute increments.
goals_all_min_0_to_10_home - goals_all_min_81_to_90_home / goals_all_min_0_to_10_away - goals_all_min_81_to_90_away
Number of goals scored and conceded during this time period. This season at home games only or away games only.
goals_all_min_0_to_15_home - goals_all_min_76_to_90_home / goals_all_min_0_to_15_away - goals_all_min_76_to_90_away
Number of goals scored and conceded during this time period. This season at home games only or at away games only. This is in 15 minute increments.
name_pt - name_fi
Name of the team in the following languages : Spanish, Portuguese, Korean, Turkish, Arabic, Japanese, Russian, German, Swedish, Chinese Traditional, Chinese Simplified, Greek, Polish, Thai, French, Croatian, Czech, Hungarian, Danish, Vietnamese, Slovakian, Bulgarian, Finnish. Not all languages are always available and may default to English depending on availability.
women
1 = Women's team. Null = Men's team
prediction_risk
Prediction Risk represents how often a team scores or concedes goals within close proximity of each other. For example - if Manchester United Scores a goal at min 55', and then concedes immediately at min 58', it will increase their Risk rating. The more times this happens across a single season, the more risk there is of unexpected goals occurring.



League Players
Stats for all players that participated in a season of a league.

Get Array of Players
GEThttps://api.football-data-api.com/league-players?key=4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756&season_id=*
Sample Response (Access the URL below)
https://api.football-data-api.com/league-players?key=4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756&season_id=2012&include=stats
This endpoint provides an array of players that have played in the particular league/season ID. Each player object has attributes described in https://footystats.org/api/documentations/player-individual
Query Parameters
Name
Type
Description
page
integer
Pagination. Each page has 200 players max. If there is more players returned, then they are in page=2 and beyond.
max_time
integer
UNIX timestamp. Set this number if you would like the API to return the stats of the league and the teams up to a certain time. For example, if I enter &max_time=1537984169, then the API will respond with stats as of Sept 26, 2018.
key
*
string
Your API Key
season_id
*
integer
ID of the league season that you would like to retrieve.
200 Successfully retrieved all leagues.Hide ↑Copy
{
    "success": true,
    "data": [
        {
            "id": 2984,
            "competition_id": 161,
            "full_name": "Petr Čech",
            "first_name": "Petr",
            "last_name": "Čech",
            "known_as": "Petr Čech",
            "shorthand": "petr-cech",
            "age": 36,
            "league": "Premier League",
            "league_type": "Domestic League",
            "season": "2017/2018",
            "starting_year": "2017",
            "ending_year": "2018",
            "url": "/players/czech-republic/petr-cech",
            "club_team_id": 59,
            "club_team_2_id": -1,
            "national_team_id": -1,
            "position": "Goalkeeper",
            "minutes_played_overall": 3040,
            "minutes_played_home": 1510,
            "minutes_played_away": 1530,
            "birthday": 390726000,
            "nationality": "Czech Republic",
            "continent": "eu",
            "appearances_overall": 34,
            "appearances_home": 17,
            "appearances_away": 17,
            "goals_overall": 0
        }
    ]
}
Queries and Parameters
You can test this API call by using the key "example" and loading the matches from the English Premier League 2018/2019 season (ID: 1625).

Variable Name
Description
id
ID of the Player.
competition_id
ID of the Season.
full_name
Player's full name.
first_name
Player's first name.
last_name
Player's last name.
known_as
What the player is known as.
shorthand
String with spaces replaced by - , and diacritics removed.
age
Player's current age.
league
In which league is the player currently playing in.
league_type
Player league's scale.
season
What season the latest for this league.
starting_year
In what year did the season start, for example if the season is 2022/2023, the starting_year will be 2022.
ending_year
In what year did the season end, for example if the season is 2022/2023, the ending_year will be 2023.
url
Player's current url on FootyStats you will need to add https://footystats.org before it to access the player page.
club_team_id
The club id of the team the player is evolving in.
club_team_2_id
The club id of the team the player has been lent to, -1 is the base value and means that the player is not on a loan.
national_team_id
The the national team id the player is playing for, -1 is the base value and means that the player is not in the national team.
position
Potition the player is currently evolving in.
minutes_played_overall
Shows how many minutes the player has played for the team this season.
minutes_played_home
Shows how many minutes the player has played when at home for the team this season.
minutes_played_away
Shows how many minutes the player has played when away for the team this season.
birthday
UNIX timestamp of the player's birth.
nationality
Player's nationality.
continent
What continent is the player from.
appearances_overall
How many matches has the player appeared in this season.
appearances_home
How many matches has the player appeared in for home games this season.
appearances_away
How many matches has the player appeared in for away games this season..
goals_overall
How many goals the player scored this season.

League Referees
Get Array of Referees
GEThttps://api.football-data-api.com/league-referees?key=4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756&season_id=*
This endpoint provides an array of referees that have refereed in the particular league/season ID
Query Parameters
Name
Type
Description
max_time
integer
UNIX timestamp. Set this number if you would like the API to return the stats of the league and the teams up to a certain time. For example, if I enter &max_time=1537984169, then the API will respond with stats as of Sept 26, 2018.
key
*
string
Your API Key
season_id
*
integer
ID of the league season that you would like to retrieve.
200 Successfully retrieved all leagues.Hide ↑Copy
{
    "success": true,
    "pager": {
        "current_page": 1,
        "max_page": 1,
        "results_per_page": 200,
        "total_results": 21
    },
    "data": [
        {
            "id": 393,
            "competition_id": 2012,
            "full_name": "Michael Oliver",
            "first_name": "Michael",
            "last_name": "Oliver",
            "known_as": "Michael Oliver",
            "shorthand": "michael-oliver",
            "age": 35,
            "league": "Premier League",
            "league_type": "Domestic League",
            "url": "https://footystats.org/referees/england-r-michael-oliver",
            "season": "2019/2020",
            "continent": "eu",
            "starting_year": 2019,
            "ending_year": 2020,
            "birthday": 477705600,
            "nationality": "England",
            "appearances_overall": 32,
            "wins_home": 11,
            "wins_away": 13,
            "draws_overall": 8,
            "wins_per_home": 34,
            "wins_per_away": 41,
            "draws_per": 25,
            "btts_overall": 63,
            "btts_percentage": 63,
            "goals_overall": 96,
            "goals_home": 46,
            "goals_away": 50,
            "goals_per_match_overall": 3,
            "goals_per_match_home": 1.44,
            "goals_per_match_away": 1.56,
            "penalties_given_overall": 5,
            "penalties_given_home": 2,
            "penalties_given_away": 3,
            "penalties_given_per_match_overall": 0.16,
            "penalties_given_per_match_home": 0.06,
            "penalties_given_per_match_away": 0.09,
            "penalties_given_percentage_overall": 16,
            "penalties_given_percentage_home": 6,
            "penalties_given_percentage_away": 9,
            "cards_overall": 105,
            "cards_home": 54,
            "cards_away": 51,
            "cards_per_match_overall": 3.28,
            "cards_per_match_home": 1.69,
            "cards_per_match_away": 1.59,
            "over05_cards_overall": 31,
            "over15_cards_overall": 27,
            "over25_cards_overall": 17,
            "over35_cards_overall": 11,
            "over45_cards_overall": 10,
            "over55_cards_overall": 5,
            "over65_cards_overall": 2,
            "over05_cards_per_match_overall": 0.97,
            "over15_cards_per_match_overall": 0.84,
            "over25_cards_per_match_overall": 0.53,
            "over35_cards_per_match_overall": 0.34,
            "over45_cards_per_match_overall": 0.31,
            "over55_cards_per_match_overall": 0.16,
            "over65_cards_per_match_overall": 0.06,
            "over05_cards_percentage_overall": 97,
            "over15_cards_percentage_overall": 84,
            "over25_cards_percentage_overall": 53,
            "over35_cards_percentage_overall": 34,
            "over45_cards_percentage_overall": 31,
            "over55_cards_percentage_overall": 16,
            "over65_cards_percentage_overall": 6,
            "yellow_cards_overall": 105,
            "red_cards_overall": 0,
            "min_per_goal_overall": 30,
            "min_per_card_overall": 27
        }
    ]
}
Queries and Parameters
Variable Name
Description
id
ID of the Referee.
competition_id
Competition ID.
full_name / first_name / last_name
Full name, First name and Last name of the Referee.
known_as
Name of the referee as he is .
shorthand
Code friendly name.
age
Age of the referee.
league
Name of the league.
league_type
Type of the league.
url
FootyStats url of the referee.
season
Season year of the league.
continent
Continent of the league.
starting_year / ending_year
Starting / Ending years of the season.
birthday
UNIX birthday of the referee.
nationality
Nationality of the referee.
appearances_overall
Number of matches participated in the season.
wins_home / wins_away / draws_overall
Number of matches refereed ended with Home win, Away win or draw.
wins_per_home / wins_per_away / draws_per
Percentage value of matches ending in Home win, Away win or draw.
May not always end up accounting to exactly 100% because some numbers are rounded.
btts_overall
BTTS overall.
btts_percentage
Percentage of BTTS.
goals_overall
Number of goals total.
goals_home / goals_away
Number of goals Home and Away.
goals_per_match_overall / goals_per_match_home / goals_per_match_away
Average goal per match Overall, Home or Away.
penalties_given_overall / penalties_given_home / penalties_given_away
Penalties given Overall, Home or Away.
penalties_given_per_match_overall / penalties_given_per_match_home / penalties_given_per_match_away
Penalties given per match Overall, Home or Away.
penalties_given_percentage_overall / penalties_given_percentage_home / penalties_given_percentage_away
Penalties given percentage Overall, Home or Away.
cards_overall, cards_home, cards_away
Cards distributed Overall, Home or Away.
cards_per_match_overall / cards_per_match_home / cards_per_match_away
Average cards distributed per match Overall, Home or Away.
over05_cards_overall (0.5 - 6.5)
Number of Over 0.5 to Over 6.5 cards distributed.
over05_cards_per_match_overall (0.5 - 6.5)
Average number of Over 0.5 to Over 6.5 cards distributed.
over05_cards_percentage_overall (0.5 - 6.5)
Percentage of Over 0.5 to Over 6.5 cards distributed.
yellow_cards_overall / red_cards_overall
Number of yellow cards and red cards distributed.
min_per_goal_overall
Average time between goals accorded.
min_per_card_overall
Average time between cards given.


Team
Individual team stats. Returns relevant team data.

Get Data For an Individual Team
GEThttps://api.football-data-api.com/team?key=4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756&team_id=TEAM_ID&include=stats
Sample Response (Access the URL below)
https://api.football-data-api.com/team?key=4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756&team_id=59&include=stats
Returns the data of each team as a JSON array.
Add &include=stats to the request to get the stats of each team !
Query Parameters
Name
Type
Description
key
*
string
Your API Key
team_id
*
integer
ID of the team that you would like to retrieve.
200 Successfully retrieved team data.Hide ↑Copy
{
    "success": true,
    "pager": {
        "current_page": 1,
        "max_page": 1,
        "results_per_page": 50,
        "total_results": 12
    },
    "data": [
        {
            "id": 59,
            "continent": null,
            "image": "https://cdn.footystats.org/img/teams/england-arsenal-fc.png",
            "season": "2024",
            "url": "https://footystats.org/clubs/arsenal-fc-59",
            "table_position": 0,
            "performance_rank": 29,
            "risk": 0,
            "season_format": "International",
            "competition_id": 11042,
            "founded": "1886",
            "country": "England",
            "name": "Arsenal",
            "full_name": "Arsenal FC",
            "english_name": "Arsenal FC",
            "alt_names": [
                "The Gunners"
            ],
            "official_sites": [
                "https://www.arsenal.com/"
            ],
            "stats": {
                "suspended_matches": 0,
                "homeAttackAdvantage": 0,
                "homeDefenceAdvantage": 0,
                "homeOverallAdvantage": 0,
                "seasonGoals_overall": 0,
                "seasonConceded_overall": 0,
                "seasonGoalsTotal_overall": 0,
                "seasonGoalsTotal_home": 0,
                "seasonGoalsTotal_away": 0,
                "seasonScoredNum_overall": 0,
                "seasonScoredNum_home": 0,
                "seasonScoredNum_away": 0,
                "seasonConcededNum_overall": 0,
                "seasonConcededNum_home": 0,
                "seasonConcededNum_away": 0,
                "seasonGoalsMin_overall": 0,
                "seasonGoalsMin_home": 0,
                "seasonGoalsMin_away": 0,
                "seasonScoredMin_overall": 0,
                "seasonScoredMin_home": 0,
                "seasonScoredMin_away": 0,
                "seasonConcededMin_overall": 0,
                "seasonConcededMin_home": 0,
                "seasonConcededMin_away": 0,
                "seasonGoalDifference_overall": 0,
                "seasonGoalDifference_home": 0,
                "seasonGoalDifference_away": 0,
                "seasonWinsNum_overall": 0,
                "seasonWinsNum_home": 0,
                "seasonWinsNum_away": 0,
                "seasonDrawsNum_overall": 0,
                "seasonDrawsNum_home": 0,
                "seasonDrawsNum_away": 0,
                "seasonLossesNum_overall": 0,
                "seasonLossesNum_home": 0,
                "seasonLossesNum_away": 0,
                "seasonMatchesPlayed_overall": 0,
                "seasonMatchesPlayed_away": 0,
                "seasonMatchesPlayed_home": 0,
                "seasonHighestScored_home": 0,
                "seasonHighestConceded_home": 0,
                "seasonHighestScored_away": 0,
                "seasonHighestConceded_away": 0,
                "seasonCS_overall": 0,
                "seasonCS_home": 0,
                "seasonCS_away": 0,
                "seasonCSPercentage_overall": 0,
                "seasonCSPercentage_home": 0,
                "seasonCSPercentage_away": 0,
                "seasonCSHT_overall": 0,
                "seasonCSHT_home": 0,
                "seasonCSHT_away": 0,
                "seasonCSPercentageHT_overall": 0,
                "seasonCSPercentageHT_home": 0,
                "seasonCSPercentageHT_away": 0,
                "seasonFTS_overall": 0,
                "seasonFTSPercentage_overall": 0,
                "seasonFTSPercentage_home": 0,
                "seasonFTSPercentage_away": 0,
                "seasonFTS_home": 0,
                "seasonFTS_away": 0,
                "seasonFTSHT_overall": 0,
                "seasonFTSPercentageHT_overall": 0,
                "seasonFTSPercentageHT_home": 0,
                "seasonFTSPercentageHT_away": 0,
                "seasonFTSHT_home": 0,
                "seasonFTSHT_away": 0,
                "seasonBTTS_overall": 0,
                "seasonBTTS_home": 0,
                "seasonBTTS_away": 0,
                "seasonBTTSPercentage_overall": 0,
                "seasonBTTSPercentage_home": 0,
                "seasonBTTSPercentage_away": 0,
                "seasonBTTSHT_overall": 0,
                "seasonBTTSHT_home": 0,
                "seasonBTTSHT_away": 0,
                "seasonBTTSPercentageHT_overall": 0,
                "seasonBTTSPercentageHT_home": 0,
                "seasonBTTSPercentageHT_away": 0,
                "seasonPPG_overall": 0,
                "seasonPPG_home": 0,
                "seasonPPG_away": 0,
                "seasonAVG_overall": 0,
                "seasonAVG_home": 0,
                "seasonAVG_away": 0,
                "seasonScoredAVG_overall": 0,
                "seasonScoredAVG_home": 0,
                "seasonScoredAVG_away": 0,
                "seasonConcededAVG_overall": 0,
                "seasonConcededAVG_home": 0,
                "seasonConcededAVG_away": 0,
                "winPercentage_overall": 0,
                "winPercentage_home": 0,
                "winPercentage_away": 0,
                "drawPercentage_overall": 0,
                "drawPercentage_home": 0,
                "drawPercentage_away": 0,
                "losePercentage_overall": 0,
                "losePercentage_home": 0,
                "losePercentage_away": 0,
                "leadingAtHT_overall": 0,
                "leadingAtHT_home": 0,
                "leadingAtHT_away": 0,
                "leadingAtHTPercentage_overall": 0,
                "leadingAtHTPercentage_home": 0,
                "leadingAtHTPercentage_away": 0,
                "drawingAtHT_home": 0,
                "drawingAtHT_away": 0,
                "drawingAtHT_overall": 0,
                "drawingAtHTPercentage_home": 0,
                "drawingAtHTPercentage_away": 0,
                "drawingAtHTPercentage_overall": 0,
                "trailingAtHT_home": 0,
                "trailingAtHT_away": 0,
                "trailingAtHT_overall": 0,
                "trailingAtHTPercentage_home": 0,
                "trailingAtHTPercentage_away": 0,
                "trailingAtHTPercentage_overall": 0,
                "HTPoints_overall": 0,
                "HTPoints_home": 0,
                "HTPoints_away": 0,
                "HTPPG_overall": 0,
                "HTPPG_home": 0,
                "HTPPG_away": 0,
                "scoredAVGHT_overall": 0,
                "scoredAVGHT_home": 0,
                "scoredAVGHT_away": 0,
                "concededAVGHT_overall": 0,
                "concededAVGHT_home": 0,
                "concededAVGHT_away": 0,
                "AVGHT_overall": 0,
                "AVGHT_home": 0,
                "AVGHT_away": 0,
                "scoredGoalsHT_overall": 0,
                "scoredGoalsHT_home": 0,
                "scoredGoalsHT_away": 0,
                "concededGoalsHT_overall": 0,
                "concededGoalsHT_home": 0,
                "concededGoalsHT_away": 0,
                "GoalsHT_overall": 0,
                "GoalsHT_home": 0,
                "GoalsHT_away": 0,
                "GoalDifferenceHT_overall": 0,
                "GoalDifferenceHT_home": 0,
                "GoalDifferenceHT_away": 0,
                "seasonOver55Num_overall": 0,
                "seasonOver45Num_overall": 0,
                "seasonOver35Num_overall": 0,
                "seasonOver25Num_overall": 0,
                "seasonOver15Num_overall": 0,
                "seasonOver05Num_overall": 0,
                "seasonOver55Percentage_overall": 0,
                "seasonOver45Percentage_overall": 0,
                "seasonOver35Percentage_overall": 0,
                "seasonOver25Percentage_overall": 0,
                "seasonOver15Percentage_overall": 0,
                "seasonOver05Percentage_overall": 0,
                "seasonUnder55Percentage_overall": 0,
                "seasonUnder45Percentage_overall": 0,
                "seasonUnder35Percentage_overall": 0,
                "seasonUnder25Percentage_overall": 0,
                "seasonUnder15Percentage_overall": 0,
                "seasonUnder05Percentage_overall": 0,
                "seasonUnder55Num_overall": 0,
                "seasonUnder45Num_overall": 0,
                "seasonUnder35Num_overall": 0,
                "seasonUnder25Num_overall": 0,
                "seasonUnder15Num_overall": 0,
                "seasonUnder05Num_overall": 0,
                "seasonOver55Percentage_home": 0,
                "seasonOver45Percentage_home": 0,
                "seasonOver35Percentage_home": 0,
                "seasonOver25Percentage_home": 0,
                "seasonOver15Percentage_home": 0,
                "seasonOver05Percentage_home": 0,
                "seasonOver55Num_home": 0,
                "seasonOver45Num_home": 0,
                "seasonOver35Num_home": 0,
                "seasonOver25Num_home": 0,
                "seasonOver15Num_home": 0,
                "seasonOver05Num_home": 0,
                "seasonUnder55Percentage_home": 0,
                "seasonUnder45Percentage_home": 0,
                "seasonUnder35Percentage_home": 0,
                "seasonUnder25Percentage_home": 0,
                "seasonUnder15Percentage_home": 0,
                "seasonUnder05Percentage_home": 0,
                "seasonUnder55Num_home": 0,
                "seasonUnder45Num_home": 0,
                "seasonUnder35Num_home": 0,
                "seasonUnder25Num_home": 0,
                "seasonUnder15Num_home": 0,
                "seasonUnder05Num_home": 0,
                "seasonOver55Percentage_away": 0,
                "seasonOver45Percentage_away": 0,
                "seasonOver35Percentage_away": 0,
                "seasonOver25Percentage_away": 0,
                "seasonOver15Percentage_away": 0,
                "seasonOver05Percentage_away": 0,
                "seasonOver55Num_away": 0,
                "seasonOver45Num_away": 0,
                "seasonOver35Num_away": 0,
                "seasonOver25Num_away": 0,
                "seasonOver15Num_away": 0,
                "seasonOver05Num_away": 0,
                "seasonUnder55Percentage_away": 0,
                "seasonUnder45Percentage_away": 0,
                "seasonUnder35Percentage_away": 0,
                "seasonUnder25Percentage_away": 0,
                "seasonUnder15Percentage_away": 0,
                "seasonUnder05Percentage_away": 0,
                "seasonUnder55Num_away": 0,
                "seasonUnder45Num_away": 0,
                "seasonUnder35Num_away": 0,
                "seasonUnder25Num_away": 0,
                "seasonUnder15Num_away": 0,
                "seasonUnder05Num_away": 0,
                "seasonOver25NumHT_overall": 0,
                "seasonOver15NumHT_overall": 0,
                "seasonOver05NumHT_overall": 0,
                "seasonOver25PercentageHT_overall": 0,
                "seasonOver15PercentageHT_overall": 0,
                "seasonOver05PercentageHT_overall": 0,
                "seasonOver25PercentageHT_home": 0,
                "seasonOver15PercentageHT_home": 0,
                "seasonOver05PercentageHT_home": 0,
                "seasonOver25NumHT_home": 0,
                "seasonOver15NumHT_home": 0,
                "seasonOver05NumHT_home": 0,
                "seasonOver25PercentageHT_away": 0,
                "seasonOver15PercentageHT_away": 0,
                "seasonOver05PercentageHT_away": 0,
                "seasonOver25NumHT_away": 0,
                "seasonOver15NumHT_away": 0,
                "seasonOver05NumHT_away": 0,
                "cornersRecorded_matches_overall": 0,
                "cornersRecorded_matches_home": 0,
                "cornersRecorded_matches_away": 0,
                "over65Corners_overall": 0,
                "over75Corners_overall": 0,
                "over85Corners_overall": 0,
                "over95Corners_overall": 0,
                "over105Corners_overall": 0,
                "over115Corners_overall": 0,
                "over125Corners_overall": 0,
                "over135Corners_overall": 0,
                "over145Corners_overall": 0,
                "over65CornersPercentage_overall": 0,
                "over75CornersPercentage_overall": 0,
                "over85CornersPercentage_overall": 0,
                "over95CornersPercentage_overall": 0,
                "over105CornersPercentage_overall": 0,
                "over115CornersPercentage_overall": 0,
                "over125CornersPercentage_overall": 0,
                "over135CornersPercentage_overall": 0,
                "over145CornersPercentage_overall": 0,
                "over65Corners_home": 0,
                "over75Corners_home": 0,
                "over85Corners_home": 0,
                "over95Corners_home": 0,
                "over105Corners_home": 0,
                "over115Corners_home": 0,
                "over125Corners_home": 0,
                "over135Corners_home": 0,
                "over145Corners_home": 0,
                "over65CornersPercentage_home": 0,
                "over75CornersPercentage_home": 0,
                "over85CornersPercentage_home": 0,
                "over95CornersPercentage_home": 0,
                "over105CornersPercentage_home": 0,
                "over115CornersPercentage_home": 0,
                "over125CornersPercentage_home": 0,
                "over135CornersPercentage_home": 0,
                "over145CornersPercentage_home": 0,
                "over65Corners_away": 0,
                "over75Corners_away": 0,
                "over85Corners_away": 0,
                "over95Corners_away": 0,
                "over105Corners_away": 0,
                "over115Corners_away": 0,
                "over125Corners_away": 0,
                "over135Corners_away": 0,
                "over145Corners_away": 0,
                "over65CornersPercentage_away": 0,
                "over75CornersPercentage_away": 0,
                "over85CornersPercentage_away": 0,
                "over95CornersPercentage_away": 0,
                "over105CornersPercentage_away": 0,
                "over115CornersPercentage_away": 0,
                "over125CornersPercentage_away": 0,
                "over135CornersPercentage_away": 0,
                "over145CornersPercentage_away": 0,
                "over25CornersFor_overall": 0,
                "over35CornersFor_overall": 0,
                "over45CornersFor_overall": 0,
                "over55CornersFor_overall": 0,
                "over65CornersFor_overall": 0,
                "over75CornersFor_overall": 0,
                "over85CornersFor_overall": 0,
                "over25CornersForPercentage_overall": 0,
                "over35CornersForPercentage_overall": 0,
                "over45CornersForPercentage_overall": 0,
                "over55CornersForPercentage_overall": 0,
                "over65CornersForPercentage_overall": 0,
                "over75CornersForPercentage_overall": 0,
                "over85CornersForPercentage_overall": 0,
                "over25CornersFor_home": 0,
                "over35CornersFor_home": 0,
                "over45CornersFor_home": 0,
                "over55CornersFor_home": 0,
                "over65CornersFor_home": 0,
                "over75CornersFor_home": 0,
                "over85CornersFor_home": 0,
                "over25CornersForPercentage_home": 0,
                "over35CornersForPercentage_home": 0,
                "over45CornersForPercentage_home": 0,
                "over55CornersForPercentage_home": 0,
                "over65CornersForPercentage_home": 0,
                "over75CornersForPercentage_home": 0,
                "over85CornersForPercentage_home": 0,
                "over25CornersFor_away": 0,
                "over35CornersFor_away": 0,
                "over45CornersFor_away": 0,
                "over55CornersFor_away": 0,
                "over65CornersFor_away": 0,
                "over75CornersFor_away": 0,
                "over85CornersFor_away": 0,
                "over25CornersForPercentage_away": 0,
                "over35CornersForPercentage_away": 0,
                "over45CornersForPercentage_away": 0,
                "over55CornersForPercentage_away": 0,
                "over65CornersForPercentage_away": 0,
                "over75CornersForPercentage_away": 0,
                "over85CornersForPercentage_away": 0,
                "over25CornersAgainst_overall": 0,
                "over35CornersAgainst_overall": 0,
                "over45CornersAgainst_overall": 0,
                "over55CornersAgainst_overall": 0,
                "over65CornersAgainst_overall": 0,
                "over75CornersAgainst_overall": 0,
                "over85CornersAgainst_overall": 0,
                "over25CornersAgainstPercentage_overall": 0,
                "over35CornersAgainstPercentage_overall": 0,
                "over45CornersAgainstPercentage_overall": 0,
                "over55CornersAgainstPercentage_overall": 0,
                "over65CornersAgainstPercentage_overall": 0,
                "over75CornersAgainstPercentage_overall": 0,
                "over85CornersAgainstPercentage_overall": 0,
                "over25CornersAgainst_home": 0,
                "over35CornersAgainst_home": 0,
                "over45CornersAgainst_home": 0,
                "over55CornersAgainst_home": 0,
                "over65CornersAgainst_home": 0,
                "over75CornersAgainst_home": 0,
                "over85CornersAgainst_home": 0,
                "over25CornersAgainstPercentage_home": 0,
                "over35CornersAgainstPercentage_home": 0,
                "over45CornersAgainstPercentage_home": 0,
                "over55CornersAgainstPercentage_home": 0,
                "over65CornersAgainstPercentage_home": 0,
                "over75CornersAgainstPercentage_home": 0,
                "over85CornersAgainstPercentage_home": 0,
                "over25CornersAgainst_away": 0,
                "over35CornersAgainst_away": 0,
                "over45CornersAgainst_away": 0,
                "over55CornersAgainst_away": 0,
                "over65CornersAgainst_away": 0,
                "over75CornersAgainst_away": 0,
                "over85CornersAgainst_away": 0,
                "over25CornersAgainstPercentage_away": 0,
                "over35CornersAgainstPercentage_away": 0,
                "over45CornersAgainstPercentage_away": 0,
                "over55CornersAgainstPercentage_away": 0,
                "over65CornersAgainstPercentage_away": 0,
                "over75CornersAgainstPercentage_away": 0,
                "over85CornersAgainstPercentage_away": 0,
                "over05Cards_overall": 0,
                "over15Cards_overall": 0,
                "over25Cards_overall": 0,
                "over35Cards_overall": 0,
                "over45Cards_overall": 0,
                "over55Cards_overall": 0,
                "over65Cards_overall": 0,
                "over75Cards_overall": 0,
                "over85Cards_overall": 0,
                "over05CardsPercentage_overall": 0,
                "over15CardsPercentage_overall": 0,
                "over25CardsPercentage_overall": 0,
                "over35CardsPercentage_overall": 0,
                "over45CardsPercentage_overall": 0,
                "over55CardsPercentage_overall": 0,
                "over65CardsPercentage_overall": 0,
                "over75CardsPercentage_overall": 0,
                "over85CardsPercentage_overall": 0,
                "over05Cards_home": 0,
                "over15Cards_home": 0,
                "over25Cards_home": 0,
                "over35Cards_home": 0,
                "over45Cards_home": 0,
                "over55Cards_home": 0,
                "over65Cards_home": 0,
                "over75Cards_home": 0,
                "over85Cards_home": 0,
                "over05CardsPercentage_home": 0,
                "over15CardsPercentage_home": 0,
                "over25CardsPercentage_home": 0,
                "over35CardsPercentage_home": 0,
                "over45CardsPercentage_home": 0,
                "over55CardsPercentage_home": 0,
                "over65CardsPercentage_home": 0,
                "over75CardsPercentage_home": 0,
                "over85CardsPercentage_home": 0,
                "over05Cards_away": 0,
                "over15Cards_away": 0,
                "over25Cards_away": 0,
                "over35Cards_away": 0,
                "over45Cards_away": 0,
                "over55Cards_away": 0,
                "over65Cards_away": 0,
                "over75Cards_away": 0,
                "over85Cards_away": 0,
                "over05CardsPercentage_away": 0,
                "over15CardsPercentage_away": 0,
                "over25CardsPercentage_away": 0,
                "over35CardsPercentage_away": 0,
                "over45CardsPercentage_away": 0,
                "over55CardsPercentage_away": 0,
                "over65CardsPercentage_away": 0,
                "over75CardsPercentage_away": 0,
                "over85CardsPercentage_away": 0,
                "over05CardsFor_overall": 0,
                "over15CardsFor_overall": 0,
                "over25CardsFor_overall": 0,
                "over35CardsFor_overall": 0,
                "over45CardsFor_overall": 0,
                "over55CardsFor_overall": 0,
                "over65CardsFor_overall": 0,
                "over05CardsForPercentage_overall": 0,
                "over15CardsForPercentage_overall": 0,
                "over25CardsForPercentage_overall": 0,
                "over35CardsForPercentage_overall": 0,
                "over45CardsForPercentage_overall": 0,
                "over55CardsForPercentage_overall": 0,
                "over65CardsForPercentage_overall": 0,
                "over05CardsFor_home": 0,
                "over15CardsFor_home": 0,
                "over25CardsFor_home": 0,
                "over35CardsFor_home": 0,
                "over45CardsFor_home": 0,
                "over55CardsFor_home": 0,
                "over65CardsFor_home": 0,
                "over05CardsForPercentage_home": 0,
                "over15CardsForPercentage_home": 0,
                "over25CardsForPercentage_home": 0,
                "over35CardsForPercentage_home": 0,
                "over45CardsForPercentage_home": 0,
                "over55CardsForPercentage_home": 0,
                "over65CardsForPercentage_home": 0,
                "over05CardsFor_away": 0,
                "over15CardsFor_away": 0,
                "over25CardsFor_away": 0,
                "over35CardsFor_away": 0,
                "over45CardsFor_away": 0,
                "over55CardsFor_away": 0,
                "over65CardsFor_away": 0,
                "over05CardsForPercentage_away": 0,
                "over15CardsForPercentage_away": 0,
                "over25CardsForPercentage_away": 0,
                "over35CardsForPercentage_away": 0,
                "over45CardsForPercentage_away": 0,
                "over55CardsForPercentage_away": 0,
                "over65CardsForPercentage_away": 0,
                "over05CardsAgainst_overall": 0,
                "over15CardsAgainst_overall": 0,
                "over25CardsAgainst_overall": 0,
                "over35CardsAgainst_overall": 0,
                "over45CardsAgainst_overall": 0,
                "over55CardsAgainst_overall": 0,
                "over65CardsAgainst_overall": 0,
                "over05CardsAgainstPercentage_overall": 0,
                "over15CardsAgainstPercentage_overall": 0,
                "over25CardsAgainstPercentage_overall": 0,
                "over35CardsAgainstPercentage_overall": 0,
                "over45CardsAgainstPercentage_overall": 0,
                "over55CardsAgainstPercentage_overall": 0,
                "over65CardsAgainstPercentage_overall": 0,
                "over05CardsAgainst_home": 0,
                "over15CardsAgainst_home": 0,
                "over25CardsAgainst_home": 0,
                "over35CardsAgainst_home": 0,
                "over45CardsAgainst_home": 0,
                "over55CardsAgainst_home": 0,
                "over65CardsAgainst_home": 0,
                "over05CardsAgainstPercentage_home": 0,
                "over15CardsAgainstPercentage_home": 0,
                "over25CardsAgainstPercentage_home": 0,
                "over35CardsAgainstPercentage_home": 0,
                "over45CardsAgainstPercentage_home": 0,
                "over55CardsAgainstPercentage_home": 0,
                "over65CardsAgainstPercentage_home": 0,
                "over05CardsAgainst_away": 0,
                "over15CardsAgainst_away": 0,
                "over25CardsAgainst_away": 0,
                "over35CardsAgainst_away": 0,
                "over45CardsAgainst_away": 0,
                "over55CardsAgainst_away": 0,
                "over65CardsAgainst_away": 0,
                "over05CardsAgainstPercentage_away": 0,
                "over15CardsAgainstPercentage_away": 0,
                "over25CardsAgainstPercentage_away": 0,
                "over35CardsAgainstPercentage_away": 0,
                "over45CardsAgainstPercentage_away": 0,
                "over55CardsAgainstPercentage_away": 0,
                "over65CardsAgainstPercentage_away": 0,
                "leaguePosition_overall": 0,
                "leaguePosition_home": 0,
                "leaguePosition_away": 0,
                "firstGoalScored_home": 0,
                "firstGoalScored_away": 0,
                "firstGoalScored_overall": 0,
                "firstGoalScoredPercentage_home": 0,
                "firstGoalScoredPercentage_away": 0,
                "firstGoalScoredPercentage_overall": 0,
                "cornersTotal_overall": 0,
                "cornersTotal_home": 0,
                "cornersTotal_away": 0,
                "cardsTotal_overall": 0,
                "cardsTotal_home": 0,
                "cardsTotal_away": 0,
                "cornersTotalAVG_overall": 0,
                "cornersTotalAVG_home": 0,
                "cornersTotalAVG_away": 0,
                "cornersAVG_overall": 0,
                "cornersAVG_home": 0,
                "cornersAVG_away": 0,
                "cornersAgainst_overall": 0,
                "cornersAgainst_home": 0,
                "cornersAgainst_away": 0,
                "cornersAgainstAVG_overall": 0,
                "cornersAgainstAVG_home": 0,
                "cornersAgainstAVG_away": 0,
                "cornersHighest_overall": 0,
                "cornersLowest_overall": -1,
                "cardsHighest_overall": 0,
                "cardsLowest_overall": 0,
                "cardsAVG_overall": 0,
                "cardsAVG_home": 0,
                "cardsAVG_away": 0,
                "shotsTotal_overall": 0,
                "shotsTotal_home": 0,
                "shotsTotal_away": 0,
                "shotsAVG_overall": 0,
                "shotsAVG_home": 0,
                "shotsAVG_away": 0,
                "shotsOnTargetTotal_overall": 0,
                "shotsOnTargetTotal_home": 0,
                "shotsOnTargetTotal_away": 0,
                "shotsOffTargetTotal_overall": 0,
                "shotsOffTargetTotal_home": 0,
                "shotsOffTargetTotal_away": 0,
                "shotsOnTargetAVG_overall": 0,
                "shotsOnTargetAVG_home": 0,
                "shotsOnTargetAVG_away": 0,
                "shotsOffTargetAVG_overall": 0,
                "shotsOffTargetAVG_home": 0,
                "shotsOffTargetAVG_away": 0,
                "possessionAVG_overall": 0,
                "possessionAVG_home": 0,
                "possessionAVG_away": 0,
                "foulsAVG_overall": 0,
                "foulsAVG_home": 0,
                "foulsAVG_away": 0,
                "foulsTotal_overall": 0,
                "foulsTotal_home": 0,
                "foulsTotal_away": 0,
                "offsidesTotal_overall": 0,
                "offsidesTotal_home": 0,
                "offsidesTotal_away": 0,
                "offsidesTeamTotal_overall": 0,
                "offsidesTeamTotal_home": 0,
                "offsidesTeamTotal_away": 0,
                "offsidesRecorded_matches_overall": 0,
                "offsidesRecorded_matches_home": 0,
                "offsidesRecorded_matches_away": 0,
                "offsidesAVG_overall": 0,
                "offsidesAVG_home": 0,
                "offsidesAVG_away": 0,
                "offsidesTeamAVG_overall": 0,
                "offsidesTeamAVG_home": 0,
                "offsidesTeamAVG_away": 0,
                "offsidesOver05_overall": 0,
                "offsidesOver15_overall": 0,
                "offsidesOver25_overall": 0,
                "offsidesOver35_overall": 0,
                "offsidesOver45_overall": 0,
                "offsidesOver55_overall": 0,
                "offsidesOver65_overall": 0,
                "over05OffsidesPercentage_overall": 0,
                "over15OffsidesPercentage_overall": 0,
                "over25OffsidesPercentage_overall": 0,
                "over35OffsidesPercentage_overall": 0,
                "over45OffsidesPercentage_overall": 0,
                "over55OffsidesPercentage_overall": 0,
                "over65OffsidesPercentage_overall": 0,
                "offsidesOver05_home": 0,
                "offsidesOver15_home": 0,
                "offsidesOver25_home": 0,
                "offsidesOver35_home": 0,
                "offsidesOver45_home": 0,
                "offsidesOver55_home": 0,
                "offsidesOver65_home": 0,
                "over05OffsidesPercentage_home": 0,
                "over15OffsidesPercentage_home": 0,
                "over25OffsidesPercentage_home": 0,
                "over35OffsidesPercentage_home": 0,
                "over45OffsidesPercentage_home": 0,
                "over55OffsidesPercentage_home": 0,
                "over65OffsidesPercentage_home": 0,
                "offsidesOver05_away": 0,
                "offsidesOver15_away": 0,
                "offsidesOver25_away": 0,
                "offsidesOver35_away": 0,
                "offsidesOver45_away": 0,
                "offsidesOver55_away": 0,
                "offsidesOver65_away": 0,
                "over05OffsidesPercentage_away": 0,
                "over15OffsidesPercentage_away": 0,
                "over25OffsidesPercentage_away": 0,
                "over35OffsidesPercentage_away": 0,
                "over45OffsidesPercentage_away": 0,
                "over55OffsidesPercentage_away": 0,
                "over65OffsidesPercentage_away": 0,
                "offsidesTeamOver05_overall": 0,
                "offsidesTeamOver15_overall": 0,
                "offsidesTeamOver25_overall": 0,
                "offsidesTeamOver35_overall": 0,
                "offsidesTeamOver45_overall": 0,
                "offsidesTeamOver55_overall": 0,
                "offsidesTeamOver65_overall": 0,
                "over05OffsidesTeamPercentage_overall": 0,
                "over15OffsidesTeamPercentage_overall": 0,
                "over25OffsidesTeamPercentage_overall": 0,
                "over35OffsidesTeamPercentage_overall": 0,
                "over45OffsidesTeamPercentage_overall": 0,
                "over55OffsidesTeamPercentage_overall": 0,
                "over65OffsidesTeamPercentage_overall": 0,
                "offsidesTeamOver05_home": 0,
                "offsidesTeamOver15_home": 0,
                "offsidesTeamOver25_home": 0,
                "offsidesTeamOver35_home": 0,
                "offsidesTeamOver45_home": 0,
                "offsidesTeamOver55_home": 0,
                "offsidesTeamOver65_home": 0,
                "over05OffsidesTeamPercentage_home": 0,
                "over15OffsidesTeamPercentage_home": 0,
                "over25OffsidesTeamPercentage_home": 0,
                "over35OffsidesTeamPercentage_home": 0,
                "over45OffsidesTeamPercentage_home": 0,
                "over55OffsidesTeamPercentage_home": 0,
                "over65OffsidesTeamPercentage_home": 0,
                "offsidesTeamOver05_away": 0,
                "offsidesTeamOver15_away": 0,
                "offsidesTeamOver25_away": 0,
                "offsidesTeamOver35_away": 0,
                "offsidesTeamOver45_away": 0,
                "offsidesTeamOver55_away": 0,
                "offsidesTeamOver65_away": 0,
                "over05OffsidesTeamPercentage_away": 0,
                "over15OffsidesTeamPercentage_away": 0,
                "over25OffsidesTeamPercentage_away": 0,
                "over35OffsidesTeamPercentage_away": 0,
                "over45OffsidesTeamPercentage_away": 0,
                "over55OffsidesTeamPercentage_away": 0,
                "over65OffsidesTeamPercentage_away": 0,
                "scoredBothHalves_overall": 0,
                "scoredBothHalves_home": 0,
                "scoredBothHalves_away": 0,
                "scoredBothHalvesPercentage_overall": 0,
                "scoredBothHalvesPercentage_home": 0,
                "scoredBothHalvesPercentage_away": 0,
                "seasonMatchesPlayedGoalTimingRecorded_overall": 0,
                "seasonMatchesPlayedGoalTimingRecorded_home": 0,
                "seasonMatchesPlayedGoalTimingRecorded_away": 0,
                "BTTS_and_win_overall": 0,
                "BTTS_and_win_home": 0,
                "BTTS_and_win_away": 0,
                "BTTS_and_win_percentage_overall": 0,
                "BTTS_and_win_percentage_home": 0,
                "BTTS_and_win_percentage_away": 0,
                "BTTS_and_draw_overall": 0,
                "BTTS_and_draw_home": 0,
                "BTTS_and_draw_away": 0,
                "BTTS_and_draw_percentage_overall": 0,
                "BTTS_and_draw_percentage_home": 0,
                "BTTS_and_draw_percentage_away": 0,
                "BTTS_and_lose_overall": 0,
                "BTTS_and_lose_home": 0,
                "BTTS_and_lose_away": 0,
                "BTTS_and_lose_percentage_overall": 0,
                "BTTS_and_lose_percentage_home": 0,
                "BTTS_and_lose_percentage_away": 0,
                "AVG_2hg_overall": 0,
                "AVG_2hg_home": 0,
                "AVG_2hg_away": 0,
                "scored_2hg_avg_overall": 0,
                "scored_2hg_avg_home": 0,
                "scored_2hg_avg_away": 0,
                "conceded_2hg_avg_overall": 0,
                "conceded_2hg_avg_home": 0,
                "conceded_2hg_avg_away": 0,
                "total_2hg_overall": 0,
                "total_2hg_home": 0,
                "total_2hg_away": 0,
                "conceded_2hg_overall": 0,
                "conceded_2hg_home": 0,
                "conceded_2hg_away": 0,
                "scored_2hg_overall": 0,
                "scored_2hg_home": 0,
                "scored_2hg_away": 0,
                "over25_2hg_num_overall": 0,
                "over15_2hg_num_overall": 0,
                "over05_2hg_num_overall": 0,
                "over25_2hg_percentage_overall": 0,
                "over15_2hg_percentage_overall": 0,
                "over05_2hg_percentage_overall": 0,
                "over25_2hg_num_home": 0,
                "over15_2hg_num_home": 0,
                "over05_2hg_num_home": 0,
                "over25_2hg_percentage_home": 0,
                "over15_2hg_percentage_home": 0,
                "over05_2hg_percentage_home": 0,
                "over25_2hg_num_away": 0,
                "over15_2hg_num_away": 0,
                "over05_2hg_num_away": 0,
                "over25_2hg_percentage_away": 0,
                "over15_2hg_percentage_away": 0,
                "over05_2hg_percentage_away": 0,
                "points_2hg_overall": 0,
                "points_2hg_home": 0,
                "points_2hg_away": 0,
                "ppg_2hg_overall": 0,
                "ppg_2hg_home": 0,
                "ppg_2hg_away": 0,
                "wins_2hg_overall": 0,
                "wins_2hg_home": 0,
                "wins_2hg_away": 0,
                "wins_2hg_percentage_overall": 0,
                "wins_2hg_percentage_home": 0,
                "wins_2hg_percentage_away": 0,
                "draws_2hg_overall": 0,
                "draws_2hg_home": 0,
                "draws_2hg_away": 0,
                "draws_2hg_percentage_overall": 0,
                "draws_2hg_percentage_home": 0,
                "draws_2hg_percentage_away": 0,
                "losses_2hg_overall": 0,
                "losses_2hg_home": 0,
                "losses_2hg_away": 0,
                "losses_2hg_percentage_overall": 0,
                "losses_2hg_percentage_home": 0,
                "losses_2hg_percentage_away": 0,
                "gd_2hg_overall": 0,
                "gd_2hg_home": 0,
                "gd_2hg_away": 0,
                "btts_2hg_overall": 0,
                "btts_2hg_home": 0,
                "btts_2hg_away": 0,
                "btts_2hg_percentage_overall": 0,
                "btts_2hg_percentage_home": 0,
                "btts_2hg_percentage_away": 0,
                "btts_fhg_overall": 0,
                "btts_fhg_home": 0,
                "btts_fhg_away": 0,
                "btts_fhg_percentage_overall": 0,
                "btts_fhg_percentage_home": 0,
                "btts_fhg_percentage_away": 0,
                "cs_2hg_overall": 0,
                "cs_2hg_home": 0,
                "cs_2hg_away": 0,
                "cs_2hg_percentage_overall": 0,
                "cs_2hg_percentage_home": 0,
                "cs_2hg_percentage_away": 0,
                "fts_2hg_overall": 0,
                "fts_2hg_home": 0,
                "fts_2hg_away": 0,
                "fts_2hg_percentage_overall": 0,
                "fts_2hg_percentage_home": 0,
                "fts_2hg_percentage_away": 0,
                "BTTS_both_halves_overall": 0,
                "BTTS_both_halves_home": 0,
                "BTTS_both_halves_away": 0,
                "BTTS_both_halves_percentage_overall": 0,
                "BTTS_both_halves_percentage_home": 0,
                "BTTS_both_halves_percentage_away": 0,
                "average_attendance_overall": 0,
                "average_attendance_home": 0,
                "average_attendance_away": 0,
                "cornerTimingRecorded_matches_overall": 0,
                "cornerTimingRecorded_matches_home": 0,
                "cornerTimingRecorded_matches_away": 0,
                "corners_fh_overall": 0,
                "corners_2h_overall": 0,
                "corners_fh_home": 0,
                "corners_2h_home": 0,
                "corners_fh_away": 0,
                "corners_2h_away": 0,
                "corners_fh_avg_overall": 0,
                "corners_2h_avg_overall": 0,
                "corners_fh_avg_home": 0,
                "corners_2h_avg_home": 0,
                "corners_fh_avg_away": 0,
                "corners_2h_avg_away": 0,
                "corners_fh_over4_overall": 0,
                "corners_2h_over4_overall": 0,
                "corners_fh_over4_home": 0,
                "corners_2h_over4_home": 0,
                "corners_fh_over4_away": 0,
                "corners_2h_over4_away": 0,
                "corners_fh_over4_percentage_overall": 0,
                "corners_2h_over4_percentage_overall": 0,
                "corners_fh_over4_percentage_home": 0,
                "corners_2h_over4_percentage_home": 0,
                "corners_fh_over4_percentage_away": 0,
                "corners_2h_over4_percentage_away": 0,
                "corners_fh_over5_overall": 0,
                "corners_2h_over5_overall": 0,
                "corners_fh_over5_home": 0,
                "corners_2h_over5_home": 0,
                "corners_fh_over5_away": 0,
                "corners_2h_over5_away": 0,
                "corners_fh_over5_percentage_overall": 0,
                "corners_2h_over5_percentage_overall": 0,
                "corners_fh_over5_percentage_home": 0,
                "corners_2h_over5_percentage_home": 0,
                "corners_fh_over5_percentage_away": 0,
                "corners_2h_over5_percentage_away": 0,
                "corners_fh_over6_overall": 0,
                "corners_2h_over6_overall": 0,
                "corners_fh_over6_home": 0,
                "corners_2h_over6_home": 0,
                "corners_fh_over6_away": 0,
                "corners_2h_over6_away": 0,
                "corners_fh_over6_percentage_overall": 0,
                "corners_2h_over6_percentage_overall": 0,
                "corners_fh_over6_percentage_home": 0,
                "corners_2h_over6_percentage_home": 0,
                "corners_fh_over6_percentage_away": 0,
                "corners_2h_over6_percentage_away": 0,
                "attack_num_recoded_matches_overall": 0,
                "dangerous_attacks_num_overall": 0,
                "attacks_num_overall": 0,
                "dangerous_attacks_avg_overall": 0,
                "dangerous_attacks_avg_home": 0,
                "dangerous_attacks_avg_away": 0,
                "attacks_avg_overall": 0,
                "attacks_avg_home": 0,
                "attacks_avg_away": 0,
                "xg_for_avg_overall": 0,
                "xg_for_avg_home": 0,
                "xg_for_avg_away": 0,
                "xg_against_avg_overall": 0,
                "xg_against_avg_home": 0,
                "xg_against_avg_away": 0,
                "additional_info": {
                    "attack_num_recoded_matches_home": 0,
                    "attack_num_recoded_matches_away": 0,
                    "dangerous_attacks_num_home": 0,
                    "dangerous_attacks_num_away": 0,
                    "attacks_num_home": 0,
                    "attacks_num_away": 0,
                    "xg_for_overall": -2,
                    "xg_for_home": -1,
                    "xg_for_away": -1,
                    "xg_against_overall": -2,
                    "xg_against_home": -1,
                    "xg_against_away": -1,
                    "seasonScoredOver35Num_overall": 0,
                    "seasonScoredOver25Num_overall": 0,
                    "seasonScoredOver15Num_overall": 0,
                    "seasonScoredOver05Num_overall": 0,
                    "seasonScoredOver35Percentage_overall": 0,
                    "seasonScoredOver25Percentage_overall": 0,
                    "seasonScoredOver15Percentage_overall": 0,
                    "seasonScoredOver05Percentage_overall": 0,
                    "seasonScoredOver35Num_home": 0,
                    "seasonScoredOver25Num_home": 0,
                    "seasonScoredOver15Num_home": 0,
                    "seasonScoredOver05Num_home": 0,
                    "seasonScoredOver35Percentage_home": 0,
                    "seasonScoredOver25Percentage_home": 0,
                    "seasonScoredOver15Percentage_home": 0,
                    "seasonScoredOver05Percentage_home": 0,
                    "seasonScoredOver35Num_away": 0,
                    "seasonScoredOver25Num_away": 0,
                    "seasonScoredOver15Num_away": 0,
                    "seasonScoredOver05Num_away": 0,
                    "seasonScoredOver35Percentage_away": 0,
                    "seasonScoredOver25Percentage_away": 0,
                    "seasonScoredOver15Percentage_away": 0,
                    "seasonScoredOver05Percentage_away": 0,
                    "seasonConcededOver35Num_overall": 0,
                    "seasonConcededOver25Num_overall": 0,
                    "seasonConcededOver15Num_overall": 0,
                    "seasonConcededOver05Num_overall": 0,
                    "seasonConcededOver35Percentage_overall": 0,
                    "seasonConcededOver25Percentage_overall": 0,
                    "seasonConcededOver15Percentage_overall": 0,
                    "seasonConcededOver05Percentage_overall": 0,
                    "seasonConcededOver35Num_home": 0,
                    "seasonConcededOver25Num_home": 0,
                    "seasonConcededOver15Num_home": 0,
                    "seasonConcededOver05Num_home": 0,
                    "seasonConcededOver35Percentage_home": 0,
                    "seasonConcededOver25Percentage_home": 0,
                    "seasonConcededOver15Percentage_home": 0,
                    "seasonConcededOver05Percentage_home": 0,
                    "formRun_overall": "",
                    "formRun_home": "",
                    "formRun_away": "",
                    "seasonConcededOver35Num_away": 0,
                    "seasonConcededOver25Num_away": 0,
                    "seasonConcededOver15Num_away": 0,
                    "seasonConcededOver05Num_away": 0,
                    "seasonConcededOver35Percentage_away": 0,
                    "seasonConcededOver25Percentage_away": 0,
                    "seasonConcededOver15Percentage_away": 0,
                    "seasonConcededOver05Percentage_away": 0,
                    "cardTimingRecorded_matches_overall": 0,
                    "cardTimingRecorded_matches_home": 0,
                    "cardTimingRecorded_matches_away": 0,
                    "cardsRecorded_matches_overall": 0,
                    "cardsRecorded_matches_home": 0,
                    "cardsRecorded_matches_away": 0,
                    "fh_cards_total_overall": 0,
                    "fh_cards_total_home": 0,
                    "fh_cards_total_away": 0,
                    "2h_cards_total_overall": 0,
                    "2h_cards_total_home": 0,
                    "2h_cards_total_away": 0,
                    "fh_cards_for_overall": 0,
                    "fh_cards_for_home": 0,
                    "fh_cards_for_away": 0,
                    "2h_cards_for_overall": 0,
                    "2h_cards_for_home": 0,
                    "2h_cards_for_away": 0,
                    "fh_cards_against_overall": 0,
                    "fh_cards_against_home": 0,
                    "fh_cards_against_away": 0,
                    "2h_cards_against_overall": 0,
                    "2h_cards_against_home": 0,
                    "2h_cards_against_away": 0,
                    "fh_cards_for_avg_overall": 0,
                    "fh_cards_for_avg_home": 0,
                    "fh_cards_for_avg_away": 0,
                    "2h_cards_for_avg_overall": 0,
                    "2h_cards_for_avg_home": 0,
                    "2h_cards_for_avg_away": 0,
                    "fh_cards_against_avg_overall": 0,
                    "fh_cards_against_avg_home": 0,
                    "fh_cards_against_avg_away": 0,
                    "2h_cards_against_avg_overall": 0,
                    "2h_cards_against_avg_home": 0,
                    "2h_cards_against_avg_away": 0,
                    "fh_cards_total_avg_overall": 0,
                    "fh_cards_total_avg_home": 0,
                    "fh_cards_total_avg_away": 0,
                    "2h_cards_total_avg_overall": 0,
                    "2h_cards_total_avg_home": 0,
                    "2h_cards_total_avg_away": 0,
                    "fh_total_cards_under2_percentage_overall": 0,
                    "fh_total_cards_under2_percentage_home": 0,
                    "fh_total_cards_under2_percentage_away": 0,
                    "fh_total_cards_2to3_percentage_overall": 0,
                    "fh_total_cards_2to3_percentage_home": 0,
                    "fh_total_cards_2to3_percentage_away": 0,
                    "fh_total_cards_over3_percentage_overall": 0,
                    "fh_total_cards_over3_percentage_home": 0,
                    "fh_total_cards_over3_percentage_away": 0,
                    "2h_total_cards_under2_percentage_overall": 0,
                    "2h_total_cards_under2_percentage_home": 0,
                    "2h_total_cards_under2_percentage_away": 0,
                    "2h_total_cards_2to3_percentage_overall": 0,
                    "2h_total_cards_2to3_percentage_home": 0,
                    "2h_total_cards_2to3_percentage_away": 0,
                    "2h_total_cards_over3_percentage_overall": 0,
                    "2h_total_cards_over3_percentage_home": 0,
                    "2h_total_cards_over3_percentage_away": 0,
                    "fh_half_with_most_cards_total_percentage_overall": 0,
                    "fh_half_with_most_cards_total_percentage_home": 0,
                    "fh_half_with_most_cards_total_percentage_away": 0,
                    "2h_half_with_most_cards_total_percentage_overall": 0,
                    "2h_half_with_most_cards_total_percentage_home": 0,
                    "2h_half_with_most_cards_total_percentage_away": 0,
                    "fh_cards_for_over05_percentage_overall": 0,
                    "fh_cards_for_over05_percentage_home": 0,
                    "fh_cards_for_over05_percentage_away": 0,
                    "2h_cards_for_over05_percentage_overall": 0,
                    "2h_cards_for_over05_percentage_home": 0,
                    "2h_cards_for_over05_percentage_away": 0,
                    "cards_for_overall": 0,
                    "cards_for_home": 0,
                    "cards_for_away": 0,
                    "cards_against_overall": 0,
                    "cards_against_home": 0,
                    "cards_against_away": 0,
                    "cards_for_avg_overall": 0,
                    "cards_for_avg_home": 0,
                    "cards_for_avg_away": 0,
                    "cards_against_avg_overall": 0,
                    "cards_against_avg_home": 0,
                    "cards_against_avg_away": 0,
                    "cards_total_overall": 0,
                    "cards_total_home": 0,
                    "cards_total_away": 0,
                    "cards_total_avg_overall": 0,
                    "cards_total_avg_home": 0,
                    "cards_total_avg_away": 0,
                    "penalties_won_overall": 0,
                    "penalties_won_home": 0,
                    "penalties_won_away": 0,
                    "penalties_scored_overall": 0,
                    "penalties_scored_home": 0,
                    "penalties_scored_away": 0,
                    "penalties_missed_overall": 0,
                    "penalties_missed_home": 0,
                    "penalties_missed_away": 0,
                    "penalties_won_per_match_overall": 0,
                    "penalties_won_per_match_home": 0,
                    "penalties_won_per_match_away": 0,
                    "penalties_recorded_matches_overall": 0,
                    "penalties_recorded_matches_home": 0,
                    "penalties_recorded_matches_away": 0,
                    "exact_team_goals_0_ft_overall": 0,
                    "exact_team_goals_1_ft_overall": 0,
                    "exact_team_goals_2_ft_overall": 0,
                    "exact_team_goals_3_ft_overall": 0,
                    "exact_team_goals_1_ft_home": 0,
                    "exact_team_goals_2_ft_home": 0,
                    "exact_team_goals_3_ft_home": 0,
                    "exact_team_goals_0_ft_away": 0,
                    "exact_team_goals_1_ft_away": 0,
                    "exact_team_goals_2_ft_away": 0,
                    "exact_team_goals_3_ft_away": 0,
                    "match_shots_over225_num_overall": 0,
                    "match_shots_over235_num_overall": 0,
                    "match_shots_over245_num_overall": 0,
                    "match_shots_over255_num_overall": 0,
                    "match_shots_over265_num_overall": 0,
                    "match_shots_over225_num_home": 0,
                    "match_shots_over235_num_home": 0,
                    "match_shots_over245_num_home": 0,
                    "match_shots_over255_num_home": 0,
                    "match_shots_over265_num_home": 0,
                    "match_shots_over225_num_away": 0,
                    "match_shots_over235_num_away": 0,
                    "match_shots_over245_num_away": 0,
                    "match_shots_over255_num_away": 0,
                    "match_shots_over265_num_away": 0,
                    "match_shots_over225_percentage_overall": 0,
                    "match_shots_over235_percentage_overall": 0,
                    "match_shots_over245_percentage_overall": 0,
                    "match_shots_over255_percentage_overall": 0,
                    "match_shots_over265_percentage_overall": 0,
                    "match_shots_over225_percentage_home": 0,
                    "match_shots_over235_percentage_home": 0,
                    "match_shots_over245_percentage_home": 0,
                    "match_shots_over255_percentage_home": 0,
                    "match_shots_over265_percentage_home": 0,
                    "match_shots_over225_percentage_away": 0,
                    "match_shots_over235_percentage_away": 0,
                    "match_shots_over245_percentage_away": 0,
                    "match_shots_over255_percentage_away": 0,
                    "match_shots_over265_percentage_away": 0,
                    "match_shots_on_target_over75_num_overall": 0,
                    "match_shots_on_target_over85_num_overall": 0,
                    "match_shots_on_target_over95_num_overall": 0,
                    "match_shots_on_target_over75_num_home": 0,
                    "match_shots_on_target_over85_num_home": 0,
                    "match_shots_on_target_over95_num_home": 0,
                    "match_shots_on_target_over75_num_away": 0,
                    "match_shots_on_target_over85_num_away": 0,
                    "match_shots_on_target_over95_num_away": 0,
                    "match_shots_on_target_over75_percentage_overall": 0,
                    "match_shots_on_target_over85_percentage_overall": 0,
                    "match_shots_on_target_over95_percentage_overall": 0,
                    "match_shots_on_target_over75_percentage_home": 0,
                    "match_shots_on_target_over85_percentage_home": 0,
                    "match_shots_on_target_over95_percentage_home": 0,
                    "match_shots_on_target_over75_percentage_away": 0,
                    "match_shots_on_target_over85_percentage_away": 0,
                    "match_shots_on_target_over95_percentage_away": 0,
                    "team_shots_over105_num_overall": 0,
                    "team_shots_over115_num_overall": 0,
                    "team_shots_over125_num_overall": 0,
                    "team_shots_over135_num_overall": 0,
                    "team_shots_over145_num_overall": 0,
                    "team_shots_over155_num_overall": 0,
                    "team_shots_over105_num_home": 0,
                    "team_shots_over115_num_home": 0,
                    "team_shots_over125_num_home": 0,
                    "team_shots_over135_num_home": 0,
                    "team_shots_over145_num_home": 0,
                    "team_shots_over155_num_home": 0,
                    "team_shots_over105_num_away": 0,
                    "team_shots_over115_num_away": 0,
                    "team_shots_over125_num_away": 0,
                    "team_shots_over135_num_away": 0,
                    "team_shots_over145_num_away": 0,
                    "team_shots_over155_num_away": 0,
                    "team_shots_over105_percentage_overall": 0,
                    "team_shots_over115_percentage_overall": 0,
                    "team_shots_over125_percentage_overall": 0,
                    "team_shots_over135_percentage_overall": 0,
                    "team_shots_over145_percentage_overall": 0,
                    "team_shots_over155_percentage_overall": 0,
                    "team_shots_over105_percentage_home": 0,
                    "team_shots_over115_percentage_home": 0,
                    "team_shots_over125_percentage_home": 0,
                    "team_shots_over135_percentage_home": 0,
                    "team_shots_over145_percentage_home": 0,
                    "team_shots_over155_percentage_home": 0,
                    "team_shots_over105_percentage_away": 0,
                    "team_shots_over115_percentage_away": 0,
                    "team_shots_over125_percentage_away": 0,
                    "team_shots_over135_percentage_away": 0,
                    "team_shots_over145_percentage_away": 0,
                    "team_shots_over155_percentage_away": 0,
                    "team_shots_on_target_over35_num_overall": 0,
                    "team_shots_on_target_over45_num_overall": 0,
                    "team_shots_on_target_over55_num_overall": 0,
                    "team_shots_on_target_over65_num_overall": 0,
                    "team_shots_on_target_over35_num_home": 0,
                    "team_shots_on_target_over45_num_home": 0,
                    "team_shots_on_target_over55_num_home": 0,
                    "team_shots_on_target_over65_num_home": 0,
                    "team_shots_on_target_over35_num_away": 0,
                    "team_shots_on_target_over45_num_away": 0,
                    "team_shots_on_target_over55_num_away": 0,
                    "team_shots_on_target_over65_num_away": 0,
                    "team_shots_on_target_over35_percentage_overall": 0,
                    "team_shots_on_target_over45_percentage_overall": 0,
                    "team_shots_on_target_over55_percentage_overall": 0,
                    "team_shots_on_target_over65_percentage_overall": 0,
                    "team_shots_on_target_over35_percentage_home": 0,
                    "team_shots_on_target_over45_percentage_home": 0,
                    "team_shots_on_target_over55_percentage_home": 0,
                    "team_shots_on_target_over65_percentage_home": 0,
                    "team_shots_on_target_over35_percentage_away": 0,
                    "team_shots_on_target_over45_percentage_away": 0,
                    "team_shots_on_target_over55_percentage_away": 0,
                    "team_shots_on_target_over65_percentage_away": 0,
                    "win_0_10_num_overall": 0,
                    "win_0_10_num_home": 0,
                    "win_0_10_num_away": 0,
                    "draw_0_10_num_overall": 0,
                    "draw_0_10_num_home": 0,
                    "draw_0_10_num_away": 0,
                    "loss_0_10_num_overall": 0,
                    "loss_0_10_num_home": 0,
                    "loss_0_10_num_away": 0,
                    "win_0_10_percentage_overall": 0,
                    "win_0_10_percentage_home": 0,
                    "win_0_10_percentage_away": 0,
                    "draw_0_10_percentage_overall": 0,
                    "draw_0_10_percentage_home": 0,
                    "draw_0_10_percentage_away": 0,
                    "loss_0_10_percentage_overall": 0,
                    "loss_0_10_percentage_home": 0,
                    "loss_0_10_percentage_away": 0,
                    "total_goal_over05_0_10_num_overall": 0,
                    "total_goal_over05_0_10_num_home": 0,
                    "total_goal_over05_0_10_num_away": 0,
                    "total_corner_over05_0_10_num_overall": 0,
                    "total_corner_over05_0_10_num_home": 0,
                    "total_corner_over05_0_10_num_away": 0,
                    "total_cards_over05_0_10_num_overall": 0,
                    "total_cards_over05_0_10_num_home": 0,
                    "total_cards_over05_0_10_num_away": 0,
                    "total_goal_over05_0_10_percentage_overall": 0,
                    "total_goal_over05_0_10_percentage_home": 0,
                    "total_goal_over05_0_10_percentage_away": 0,
                    "total_corner_over05_0_10_percentage_overall": 0,
                    "total_corner_over05_0_10_percentage_home": 0,
                    "total_corner_over05_0_10_percentage_away": 0,
                    "total_cards_over05_0_10_percentage_overall": 0,
                    "total_cards_over05_0_10_percentage_home": 0,
                    "total_cards_over05_0_10_percentage_away": 0,
                    "fouls_recorded_overall": 0,
                    "fouls_recorded_home": 0,
                    "fouls_recorded_away": 0,
                    "fouls_against_num_overall": 0,
                    "fouls_against_num_home": 0,
                    "fouls_against_num_away": 0,
                    "fouls_against_avg_overall": 0,
                    "fouls_against_avg_home": 0,
                    "fouls_against_avg_away": 0,
                    "exact_team_goals_0_ft_percentage_overall": 0,
                    "exact_team_goals_1_ft_percentage_overall": 0,
                    "exact_team_goals_2_ft_percentage_overall": 0,
                    "exact_team_goals_3_ft_percentage_overall": 0,
                    "exact_team_goals_0_ft_percentage_home": 0,
                    "exact_team_goals_1_ft_percentage_home": 0,
                    "exact_team_goals_2_ft_percentage_home": 0,
                    "exact_team_goals_3_ft_percentage_home": 0,
                    "exact_team_goals_0_ft_percentage_away": 0,
                    "exact_team_goals_1_ft_percentage_away": 0,
                    "exact_team_goals_2_ft_percentage_away": 0,
                    "exact_team_goals_3_ft_percentage_away": 0,
                    "exact_total_goals_0_ft_overall": 0,
                    "exact_total_goals_1_ft_overall": 0,
                    "exact_total_goals_2_ft_overall": 0,
                    "exact_total_goals_3_ft_overall": 0,
                    "exact_total_goals_4_ft_overall": 0,
                    "exact_total_goals_5_ft_overall": 0,
                    "exact_total_goals_6_ft_overall": 0,
                    "exact_total_goals_7_ft_overall": 0,
                    "exact_total_goals_0_ft_home": 0,
                    "exact_total_goals_1_ft_home": 0,
                    "exact_total_goals_2_ft_home": 0,
                    "exact_total_goals_3_ft_home": 0,
                    "exact_total_goals_4_ft_home": 0,
                    "exact_total_goals_5_ft_home": 0,
                    "exact_total_goals_6_ft_home": 0,
                    "exact_total_goals_7_ft_home": 0,
                    "exact_total_goals_0_ft_away": 0,
                    "exact_total_goals_1_ft_away": 0,
                    "exact_total_goals_2_ft_away": 0,
                    "exact_total_goals_3_ft_away": 0,
                    "exact_total_goals_4_ft_away": 0,
                    "exact_total_goals_5_ft_away": 0,
                    "exact_total_goals_6_ft_away": 0,
                    "exact_total_goals_7_ft_away": 0,
                    "shots_recorded_matches_num_overall": 0,
                    "shots_recorded_matches_num_home": 0,
                    "shots_recorded_matches_num_away": 0,
                    "over25_and_btts_num_overall": 0,
                    "over25_and_btts_num_home": 0,
                    "over25_and_btts_num_away": 0,
                    "over25_and_no_btts_num_overall": 0,
                    "over25_and_no_btts_num_home": 0,
                    "over25_and_no_btts_num_away": 0,
                    "over25_and_btts_percentage_overall": 0,
                    "over25_and_btts_percentage_home": 0,
                    "over25_and_btts_percentage_away": 0,
                    "over25_and_no_btts_percentage_overall": 0,
                    "over25_and_no_btts_percentage_home": 0,
                    "over25_and_no_btts_percentage_away": 0,
                    "btts_1h2h_yes_yes_num_overall": 0,
                    "btts_1h2h_yes_yes_num_home": 0,
                    "btts_1h2h_yes_yes_num_away": 0,
                    "btts_1h2h_yes_no_num_overall": 0,
                    "btts_1h2h_yes_no_num_home": 0,
                    "btts_1h2h_yes_no_num_away": 0,
                    "btts_1h2h_no_no_num_overall": 0,
                    "btts_1h2h_no_no_num_home": 0,
                    "btts_1h2h_no_no_num_away": 0,
                    "btts_1h2h_no_yes_num_overall": 0,
                    "btts_1h2h_no_yes_num_home": 0,
                    "btts_1h2h_no_yes_num_away": 0,
                    "half_with_most_goals_is_1h_num_overall": 0,
                    "half_with_most_goals_is_1h_num_home": 0,
                    "half_with_most_goals_is_1h_num_away": 0,
                    "half_with_most_goals_is_2h_num_overall": 0,
                    "half_with_most_goals_is_2h_num_home": 0,
                    "half_with_most_goals_is_2h_num_away": 0,
                    "half_with_most_goals_is_tie_num_overall": 0,
                    "half_with_most_goals_is_tie_num_home": 0,
                    "half_with_most_goals_is_tie_num_away": 0,
                    "half_with_most_goals_is_1h_percentage_overall": 0,
                    "half_with_most_goals_is_1h_percentage_home": 0,
                    "half_with_most_goals_is_1h_percentage_away": 0,
                    "half_with_most_goals_is_2h_percentage_overall": 0,
                    "half_with_most_goals_is_2h_percentage_away": 0,
                    "half_with_most_goals_is_tie_percentage_overall": 0,
                    "half_with_most_goals_is_tie_percentage_home": 0,
                    "half_with_most_goals_is_tie_percentage_away": 0,
                    "btts_1h2h_yes_yes_percentage_overall": 0,
                    "btts_1h2h_yes_yes_percentage_home": 0,
                    "btts_1h2h_yes_yes_percentage_away": 0,
                    "btts_1h2h_yes_no_percentage_overall": 0,
                    "btts_1h2h_yes_no_percentage_home": 0,
                    "btts_1h2h_yes_no_percentage_away": 0,
                    "btts_1h2h_no_no_percentage_overall": 0,
                    "btts_1h2h_no_no_percentage_home": 0,
                    "btts_1h2h_no_no_percentage_away": 0,
                    "btts_1h2h_no_yes_percentage_overall": 0,
                    "btts_1h2h_no_yes_percentage_home": 0,
                    "btts_1h2h_no_yes_percentage_away": 0,
                    "half_with_most_goals_is_2h_percentage_home": 0,
                    "shots_per_goals_scored_overall": -1,
                    "shots_per_goals_scored_home": -1,
                    "shots_per_goals_scored_away": -1,
                    "shots_on_target_per_goals_scored_overall": -1,
                    "shots_on_target_per_goals_scored_home": -1,
                    "shots_on_target_per_goals_scored_away": -1,
                    "shot_conversion_rate_overall": -1,
                    "shot_conversion_rate_home": -1,
                    "shot_conversion_rate_away": -1,
                    "team_with_most_corners_win_num_overall": 0,
                    "team_with_most_corners_win_num_home": 0,
                    "team_with_most_corners_win_num_away": 0,
                    "team_with_most_corners_win_1h_num_overall": 0,
                    "team_with_most_corners_win_1h_num_home": 0,
                    "team_with_most_corners_win_1h_num_away": 0,
                    "team_with_most_corners_win_2h_num_overall": 0,
                    "team_with_most_corners_win_2h_num_home": 0,
                    "team_with_most_corners_win_2h_num_away": 0,
                    "team_with_most_corners_win_percentage_overall": 0,
                    "team_with_most_corners_win_percentage_home": 0,
                    "team_with_most_corners_win_percentage_away": 0,
                    "team_with_most_corners_win_1h_percentage_overall": 0,
                    "team_with_most_corners_win_1h_percentage_home": 0,
                    "team_with_most_corners_win_1h_percentage_away": 0,
                    "team_with_most_corners_win_2h_percentage_overall": 0,
                    "team_with_most_corners_win_2h_percentage_home": 0,
                    "team_with_most_corners_win_2h_percentage_away": 0,
                    "half_with_most_corners_is_1h_num_overall": 0,
                    "half_with_most_corners_is_1h_num_home": 0,
                    "half_with_most_corners_is_1h_num_away": 0,
                    "half_with_most_corners_is_2h_num_overall": 0,
                    "half_with_most_corners_is_2h_num_home": 0,
                    "half_with_most_corners_is_2h_num_away": 0,
                    "half_with_most_corners_is_draw_num_overall": 0,
                    "half_with_most_corners_is_draw_num_home": 0,
                    "half_with_most_corners_is_draw_num_away": 0,
                    "half_with_most_corners_is_1h_percentage_overall": 0,
                    "half_with_most_corners_is_1h_percentage_home": 0,
                    "half_with_most_corners_is_1h_percentage_away": 0,
                    "half_with_most_corners_is_2h_percentage_overall": 0,
                    "half_with_most_corners_is_2h_percentage_home": 0,
                    "half_with_most_corners_is_2h_percentage_away": 0,
                    "half_with_most_corners_is_draw_percentage_overall": 0,
                    "half_with_most_corners_is_draw_percentage_home": 0,
                    "half_with_most_corners_is_draw_percentage_away": 0,
                    "corners_earned_1h_num_overall": 0,
                    "corners_earned_1h_num_home": 0,
                    "corners_earned_1h_num_away": 0,
                    "corners_earned_2h_num_overall": 0,
                    "corners_earned_2h_num_home": 0,
                    "corners_earned_2h_num_away": 0,
                    "corners_earned_1h_avg_overall": 0,
                    "corners_earned_1h_avg_home": 0,
                    "corners_earned_1h_avg_away": 0,
                    "corners_earned_2h_avg_overall": 0,
                    "corners_earned_2h_avg_home": 0,
                    "corners_earned_2h_avg_away": 0,
                    "corners_earned_1h_over2_num_overall": 0,
                    "corners_earned_1h_over2_num_home": 0,
                    "corners_earned_1h_over2_num_away": 0,
                    "corners_earned_1h_over3_num_overall": 0,
                    "corners_earned_1h_over3_num_home": 0,
                    "corners_earned_1h_over3_num_away": 0,
                    "corners_earned_2h_over2_num_overall": 0,
                    "corners_earned_2h_over2_num_home": 0,
                    "corners_earned_2h_over2_num_away": 0,
                    "corners_earned_2h_over3_num_overall": 0,
                    "corners_earned_2h_over3_num_home": 0,
                    "corners_earned_2h_over3_num_away": 0,
                    "corners_earned_1h_2_to_3_num_overall": 0,
                    "corners_earned_1h_2_to_3_num_home": 0,
                    "corners_earned_1h_2_to_3_num_away": 0,
                    "corners_earned_2h_2_to_3_num_overall": 0,
                    "corners_earned_2h_2_to_3_num_home": 0,
                    "corners_earned_2h_2_to_3_num_away": 0,
                    "corners_earned_1h_over2_percentage_overall": 0,
                    "corners_earned_1h_over2_percentage_home": 0,
                    "corners_earned_1h_over2_percentage_away": 0,
                    "corners_earned_1h_over3_percentage_overall": 0,
                    "corners_earned_1h_over3_percentage_home": 0,
                    "corners_earned_1h_over3_percentage_away": 0,
                    "corners_earned_2h_over2_percentage_overall": 0,
                    "corners_earned_2h_over2_percentage_home": 0,
                    "corners_earned_2h_over2_percentage_away": 0,
                    "corners_earned_2h_over3_percentage_overall": 0,
                    "corners_earned_2h_over3_percentage_home": 0,
                    "corners_earned_2h_over3_percentage_away": 0,
                    "corners_earned_1h_2_to_3_percentage_overall": 0,
                    "corners_earned_1h_2_to_3_percentage_home": 0,
                    "corners_earned_1h_2_to_3_percentage_away": 0,
                    "corners_earned_2h_2_to_3_percentage_overall": 0,
                    "corners_earned_2h_2_to_3_percentage_home": 0,
                    "corners_earned_2h_2_to_3_percentage_away": 0,
                    "penalties_conceded_overall": 0,
                    "penalties_conceded_home": 0,
                    "penalties_conceded_away": 0,
                    "penalty_in_a_match_overall": 0,
                    "penalty_in_a_match_home": 0,
                    "penalty_in_a_match_away": 0,
                    "penalty_in_a_match_percentage_overall": 0,
                    "penalty_in_a_match_percentage_home": 0,
                    "penalty_in_a_match_percentage_away": 0,
                    "goal_kicks_recorded_matches_overall": 0,
                    "goal_kicks_recorded_matches_home": 0,
                    "goal_kicks_recorded_matches_away": 0,
                    "goal_kicks_team_num_overall": 0,
                    "goal_kicks_team_num_home": 0,
                    "goal_kicks_team_num_away": 0,
                    "goal_kicks_total_num_overall": 0,
                    "goal_kicks_total_num_home": 0,
                    "goal_kicks_total_num_away": 0,
                    "goal_kicks_team_avg_overall": 0,
                    "goal_kicks_team_avg_home": 0,
                    "goal_kicks_team_avg_away": 0,
                    "goal_kicks_total_avg_overall": 0,
                    "goal_kicks_total_avg_home": 0,
                    "goal_kicks_total_avg_away": 0,
                    "goal_kicks_team_over35_overall": 0,
                    "goal_kicks_team_over35_home": 0,
                    "goal_kicks_team_over35_away": 0,
                    "goal_kicks_team_over45_overall": 0,
                    "goal_kicks_team_over45_home": 0,
                    "goal_kicks_team_over45_away": 0,
                    "goal_kicks_team_over55_overall": 0,
                    "goal_kicks_team_over55_home": 0,
                    "goal_kicks_team_over55_away": 0,
                    "goal_kicks_team_over65_overall": 0,
                    "goal_kicks_team_over65_home": 0,
                    "goal_kicks_team_over65_away": 0,
                    "goal_kicks_team_over75_overall": 0,
                    "goal_kicks_team_over75_home": 0,
                    "goal_kicks_team_over75_away": 0,
                    "goal_kicks_team_over85_overall": 0,
                    "goal_kicks_team_over85_home": 0,
                    "goal_kicks_team_over85_away": 0,
                    "goal_kicks_team_over95_overall": 0,
                    "goal_kicks_team_over95_home": 0,
                    "goal_kicks_team_over95_away": 0,
                    "goal_kicks_team_over105_overall": 0,
                    "goal_kicks_team_over105_home": 0,
                    "goal_kicks_team_over105_away": 0,
                    "goal_kicks_team_over115_overall": 0,
                    "goal_kicks_team_over115_home": 0,
                    "goal_kicks_team_over115_away": 0,
                    "goal_kicks_total_over85_overall": 0,
                    "goal_kicks_total_over85_home": 0,
                    "goal_kicks_total_over85_away": 0,
                    "goal_kicks_total_over95_overall": 0,
                    "goal_kicks_total_over95_home": 0,
                    "goal_kicks_total_over95_away": 0,
                    "goal_kicks_total_over105_overall": 0,
                    "goal_kicks_total_over105_home": 0,
                    "goal_kicks_total_over105_away": 0,
                    "goal_kicks_total_over115_overall": 0,
                    "goal_kicks_total_over115_home": 0,
                    "goal_kicks_total_over115_away": 0,
                    "goal_kicks_total_over125_overall": 0,
                    "goal_kicks_total_over125_home": 0,
                    "goal_kicks_total_over125_away": 0,
                    "goal_kicks_total_over135_overall": 0,
                    "goal_kicks_total_over135_home": 0,
                    "goal_kicks_total_over135_away": 0,
                    "goal_kicks_total_over145_overall": 0,
                    "goal_kicks_total_over145_home": 0,
                    "goal_kicks_total_over145_away": 0,
                    "goal_kicks_total_over155_overall": 0,
                    "goal_kicks_total_over155_home": 0,
                    "goal_kicks_total_over155_away": 0,
                    "goal_kicks_total_over165_overall": 0,
                    "goal_kicks_total_over165_home": 0,
                    "goal_kicks_total_over165_away": 0,
                    "goal_kicks_total_over175_overall": 0,
                    "goal_kicks_total_over175_home": 0,
                    "goal_kicks_total_over175_away": 0,
                    "goal_kicks_total_over185_overall": 0,
                    "goal_kicks_total_over185_home": 0,
                    "goal_kicks_total_over185_away": 0,
                    "throwins_recorded_matches_overall": 0,
                    "throwins_recorded_matches_home": 0,
                    "throwins_recorded_matches_away": 0,
                    "throwins_team_num_overall": 0,
                    "throwins_team_num_home": 0,
                    "throwins_team_num_away": 0,
                    "throwins_total_num_overall": 0,
                    "throwins_total_num_home": 0,
                    "throwins_total_num_away": 0,
                    "throwins_team_avg_overall": 0,
                    "throwins_team_avg_home": 0,
                    "throwins_team_avg_away": 0,
                    "throwins_total_avg_overall": 0,
                    "throwins_total_avg_home": 0,
                    "throwins_total_avg_away": 0,
                    "throwins_team_over155_overall": 0,
                    "throwins_team_over155_home": 0,
                    "throwins_team_over155_away": 0,
                    "throwins_team_over165_overall": 0,
                    "throwins_team_over165_home": 0,
                    "throwins_team_over165_away": 0,
                    "throwins_team_over175_overall": 0,
                    "throwins_team_over175_home": 0,
                    "throwins_team_over175_away": 0,
                    "throwins_team_over185_overall": 0,
                    "throwins_team_over185_home": 0,
                    "throwins_team_over185_away": 0,
                    "throwins_team_over195_overall": 0,
                    "throwins_team_over195_home": 0,
                    "throwins_team_over195_away": 0,
                    "throwins_team_over205_overall": 0,
                    "throwins_team_over205_home": 0,
                    "throwins_team_over205_away": 0,
                    "throwins_team_over215_overall": 0,
                    "throwins_team_over215_home": 0,
                    "throwins_team_over215_away": 0,
                    "throwins_team_over225_overall": 0,
                    "throwins_team_over225_home": 0,
                    "throwins_team_over225_away": 0,
                    "throwins_team_over235_overall": 0,
                    "throwins_team_over235_home": 0,
                    "throwins_team_over235_away": 0,
                    "throwins_team_over245_overall": 0,
                    "throwins_team_over245_home": 0,
                    "throwins_team_over245_away": 0,
                    "throwins_team_over255_overall": 0,
                    "throwins_team_over255_home": 0,
                    "throwins_team_over255_away": 0,
                    "throwins_total_over375_overall": 0,
                    "throwins_total_over375_home": 0,
                    "throwins_total_over375_away": 0,
                    "throwins_total_over385_overall": 0,
                    "throwins_total_over385_home": 0,
                    "throwins_total_over385_away": 0,
                    "throwins_total_over395_overall": 0,
                    "throwins_total_over395_home": 0,
                    "throwins_total_over395_away": 0,
                    "throwins_total_over405_overall": 0,
                    "throwins_total_over405_home": 0,
                    "throwins_total_over405_away": 0,
                    "throwins_total_over415_overall": 0,
                    "throwins_total_over415_home": 0,
                    "throwins_total_over415_away": 0,
                    "throwins_total_over425_overall": 0,
                    "throwins_total_over425_home": 0,
                    "throwins_total_over425_away": 0,
                    "throwins_total_over435_overall": 0,
                    "throwins_total_over435_home": 0,
                    "throwins_total_over435_away": 0,
                    "throwins_total_over445_overall": 0,
                    "throwins_total_over445_home": 0,
                    "throwins_total_over445_away": 0,
                    "throwins_total_over455_overall": 0,
                    "throwins_total_over455_home": 0,
                    "throwins_total_over455_away": 0,
                    "throwins_total_over465_overall": 0,
                    "throwins_total_over465_home": 0,
                    "throwins_total_over465_away": 0,
                    "throwins_total_over475_overall": 0,
                    "throwins_total_over475_home": 0,
                    "throwins_total_over475_away": 0,
                    "freekicks_recorded_matches_overall": 0,
                    "freekicks_recorded_matches_home": 0,
                    "freekicks_recorded_matches_away": 0,
                    "freekicks_team_num_overall": 0,
                    "freekicks_team_num_home": 0,
                    "freekicks_team_num_away": 0,
                    "freekicks_total_num_overall": 0,
                    "freekicks_total_num_home": 0,
                    "freekicks_total_num_away": 0,
                    "freekicks_team_avg_overall": 0,
                    "freekicks_team_avg_home": 0,
                    "freekicks_team_avg_away": 0,
                    "freekicks_total_avg_overall": 0,
                    "freekicks_total_avg_home": 0,
                    "freekicks_total_avg_away": 0,
                    "freekicks_team_over75_overall": 0,
                    "freekicks_team_over75_home": 0,
                    "freekicks_team_over75_away": 0,
                    "freekicks_team_over85_overall": 0,
                    "freekicks_team_over85_home": 0,
                    "freekicks_team_over85_away": 0,
                    "freekicks_team_over95_overall": 0,
                    "freekicks_team_over95_home": 0,
                    "freekicks_team_over95_away": 0,
                    "freekicks_team_over105_overall": 0,
                    "freekicks_team_over105_home": 0,
                    "freekicks_team_over105_away": 0,
                    "freekicks_team_over115_overall": 0,
                    "freekicks_team_over115_home": 0,
                    "freekicks_team_over115_away": 0,
                    "freekicks_team_over125_overall": 0,
                    "freekicks_team_over125_home": 0,
                    "freekicks_team_over125_away": 0,
                    "freekicks_team_over135_overall": 0,
                    "freekicks_team_over135_home": 0,
                    "freekicks_team_over135_away": 0,
                    "freekicks_team_over145_overall": 0,
                    "freekicks_team_over145_home": 0,
                    "freekicks_team_over145_away": 0,
                    "freekicks_team_over155_overall": 0,
                    "freekicks_team_over155_home": 0,
                    "freekicks_team_over155_away": 0,
                    "freekicks_team_over165_overall": 0,
                    "freekicks_team_over165_home": 0,
                    "freekicks_team_over165_away": 0,
                    "freekicks_team_over175_overall": 0,
                    "freekicks_team_over175_home": 0,
                    "freekicks_team_over175_away": 0,
                    "freekicks_total_over205_overall": 0,
                    "freekicks_total_over205_home": 0,
                    "freekicks_total_over205_away": 0,
                    "freekicks_total_over215_overall": 0,
                    "freekicks_total_over215_home": 0,
                    "freekicks_total_over215_away": 0,
                    "freekicks_total_over225_overall": 0,
                    "freekicks_total_over225_home": 0,
                    "freekicks_total_over225_away": 0,
                    "freekicks_total_over235_overall": 0,
                    "freekicks_total_over235_home": 0,
                    "freekicks_total_over235_away": 0,
                    "freekicks_total_over245_overall": 0,
                    "freekicks_total_over245_home": 0,
                    "freekicks_total_over245_away": 0,
                    "freekicks_total_over255_overall": 0,
                    "freekicks_total_over255_home": 0,
                    "freekicks_total_over255_away": 0,
                    "freekicks_total_over265_overall": 0,
                    "freekicks_total_over265_home": 0,
                    "freekicks_total_over265_away": 0,
                    "freekicks_total_over275_overall": 0,
                    "freekicks_total_over275_home": 0,
                    "freekicks_total_over275_away": 0,
                    "freekicks_total_over285_overall": 0,
                    "freekicks_total_over285_home": 0,
                    "freekicks_total_over285_away": 0,
                    "freekicks_total_over295_overall": 0,
                    "freekicks_total_over295_home": 0,
                    "freekicks_total_over295_away": 0,
                    "freekicks_total_over305_overall": 0,
                    "freekicks_total_over305_home": 0,
                    "freekicks_total_over305_away": 0
                },
                "goals_scored_min_0_to_10": 0,
                "goals_conceded_min_0_to_10": 0,
                "goals_scored_min_11_to_20": 0,
                "goals_conceded_min_11_to_20": 0,
                "goals_scored_min_21_to_30": 0,
                "goals_conceded_min_21_to_30": 0,
                "goals_scored_min_31_to_40": 0,
                "goals_conceded_min_31_to_40": 0,
                "goals_scored_min_41_to_50": 0,
                "goals_conceded_min_41_to_50": 0,
                "goals_scored_min_51_to_60": 0,
                "goals_conceded_min_51_to_60": 0,
                "goals_scored_min_61_to_70": 0,
                "goals_conceded_min_61_to_70": 0,
                "goals_scored_min_71_to_80": 0,
                "goals_conceded_min_71_to_80": 0,
                "goals_scored_min_81_to_90": 0,
                "goals_conceded_min_81_to_90": 0,
                "goals_all_min_0_to_10": 0,
                "goals_all_min_11_to_20": 0,
                "goals_all_min_21_to_30": 0,
                "goals_all_min_31_to_40": 0,
                "goals_all_min_41_to_50": 0,
                "goals_all_min_51_to_60": 0,
                "goals_all_min_61_to_70": 0,
                "goals_all_min_71_to_80": 0,
                "goals_all_min_81_to_90": 0,
                "goals_all_min_0_to_15": 0,
                "goals_all_min_16_to_30": 0,
                "goals_all_min_31_to_45": 0,
                "goals_all_min_46_to_60": 0,
                "goals_all_min_61_to_75": 0,
                "goals_all_min_76_to_90": 0,
                "goals_scored_min_0_to_15": 0,
                "goals_scored_min_16_to_30": 0,
                "goals_scored_min_31_to_45": 0,
                "goals_scored_min_46_to_60": 0,
                "goals_scored_min_61_to_75": 0,
                "goals_scored_min_76_to_90": 0,
                "goals_conceded_min_0_to_15": 0,
                "goals_conceded_min_16_to_30": 0,
                "goals_conceded_min_31_to_45": 0,
                "goals_conceded_min_46_to_60": 0,
                "goals_conceded_min_61_to_75": 0,
                "goals_conceded_min_76_to_90": 0,
                "goals_scored_min_0_to_10_home": 0,
                "goals_scored_min_11_to_20_home": 0,
                "goals_scored_min_21_to_30_home": 0,
                "goals_scored_min_31_to_40_home": 0,
                "goals_scored_min_41_to_50_home": 0,
                "goals_scored_min_51_to_60_home": 0,
                "goals_scored_min_61_to_70_home": 0,
                "goals_scored_min_71_to_80_home": 0,
                "goals_scored_min_81_to_90_home": 0,
                "goals_scored_min_0_to_15_home": 0,
                "goals_scored_min_16_to_30_home": 0,
                "goals_scored_min_31_to_45_home": 0,
                "goals_scored_min_46_to_60_home": 0,
                "goals_scored_min_61_to_75_home": 0,
                "goals_scored_min_76_to_90_home": 0,
                "goals_conceded_min_0_to_10_home": 0,
                "goals_conceded_min_11_to_20_home": 0,
                "goals_conceded_min_21_to_30_home": 0,
                "goals_conceded_min_31_to_40_home": 0,
                "goals_conceded_min_41_to_50_home": 0,
                "goals_conceded_min_51_to_60_home": 0,
                "goals_conceded_min_61_to_70_home": 0,
                "goals_conceded_min_71_to_80_home": 0,
                "goals_conceded_min_81_to_90_home": 0,
                "goals_conceded_min_0_to_15_home": 0,
                "goals_conceded_min_16_to_30_home": 0,
                "goals_conceded_min_31_to_45_home": 0,
                "goals_conceded_min_46_to_60_home": 0,
                "goals_conceded_min_61_to_75_home": 0,
                "goals_conceded_min_76_to_90_home": 0,
                "goals_all_min_0_to_10_home": 0,
                "goals_all_min_11_to_20_home": 0,
                "goals_all_min_21_to_30_home": 0,
                "goals_all_min_31_to_40_home": 0,
                "goals_all_min_41_to_50_home": 0,
                "goals_all_min_51_to_60_home": 0,
                "goals_all_min_61_to_70_home": 0,
                "goals_all_min_71_to_80_home": 0,
                "goals_all_min_81_to_90_home": 0,
                "goals_all_min_0_to_15_home": 0,
                "goals_all_min_16_to_30_home": 0,
                "goals_all_min_31_to_45_home": 0,
                "goals_all_min_46_to_60_home": 0,
                "goals_all_min_61_to_75_home": 0,
                "goals_all_min_76_to_90_home": 0,
                "goals_scored_min_0_to_10_away": 0,
                "goals_scored_min_11_to_20_away": 0,
                "goals_scored_min_21_to_30_away": 0,
                "goals_scored_min_31_to_40_away": 0,
                "goals_scored_min_41_to_50_away": 0,
                "goals_scored_min_51_to_60_away": 0,
                "goals_scored_min_61_to_70_away": 0,
                "goals_scored_min_71_to_80_away": 0,
                "goals_scored_min_81_to_90_away": 0,
                "goals_scored_min_0_to_15_away": 0,
                "goals_scored_min_16_to_30_away": 0,
                "goals_scored_min_31_to_45_away": 0,
                "goals_scored_min_46_to_60_away": 0,
                "goals_scored_min_61_to_75_away": 0,
                "goals_scored_min_76_to_90_away": 0,
                "goals_conceded_min_0_to_10_away": 0,
                "goals_conceded_min_11_to_20_away": 0,
                "goals_conceded_min_21_to_30_away": 0,
                "goals_conceded_min_31_to_40_away": 0,
                "goals_conceded_min_41_to_50_away": 0,
                "goals_conceded_min_51_to_60_away": 0,
                "goals_conceded_min_61_to_70_away": 0,
                "goals_conceded_min_71_to_80_away": 0,
                "goals_conceded_min_81_to_90_away": 0,
                "goals_conceded_min_0_to_15_away": 0,
                "goals_conceded_min_16_to_30_away": 0,
                "goals_conceded_min_31_to_45_away": 0,
                "goals_conceded_min_46_to_60_away": 0,
                "goals_conceded_min_61_to_75_away": 0,
                "goals_conceded_min_76_to_90_away": 0,
                "goals_all_min_0_to_10_away": 0,
                "goals_all_min_11_to_20_away": 0,
                "goals_all_min_21_to_30_away": 0,
                "goals_all_min_31_to_40_away": 0,
                "goals_all_min_41_to_50_away": 0,
                "goals_all_min_51_to_60_away": 0,
                "goals_all_min_61_to_70_away": 0,
                "goals_all_min_71_to_80_away": 0,
                "goals_all_min_81_to_90_away": 0,
                "goals_all_min_0_to_15_away": 0,
                "goals_all_min_16_to_30_away": 0,
                "goals_all_min_31_to_45_away": 0,
                "goals_all_min_46_to_60_away": 0,
                "goals_all_min_61_to_75_away": 0,
                "goals_all_min_76_to_90_away": 0,
                "name_jp": "アーセナルFC",
                "name_tr": "Arsenal FC",
                "name_kr": "아스날",
                "name_pt": "Arsenal",
                "name_ru": "Арсенал",
                "name_es": "Arsenal FC",
                "name_se": "Arsenal",
                "name_de": "Arsenal FC",
                "name_zht": "阿森納",
                "name_nl": "Arsenal FC",
                "name_it": "Arsenal FC",
                "name_fr": "Arsenal FC",
                "name_id": "Arsenal FC",
                "name_pl": "Arsenal FC",
                "name_gr": "Αρσεναλ",
                "name_dk": "Arsenal FC",
                "name_th": "อาร์เซนอล",
                "name_hr": "Arsenal FC",
                "name_ro": "Arsenal FC",
                "name_in": "Arsenal FC",
                "name_no": "Arsenal FC",
                "name_hu": "Arsenal FC",
                "name_cz": "Arsenal FC",
                "name_cn": "阿森纳",
                "name_ara": "نادي أرسنال",
                "name_si": null,
                "name_vn": "Arsenal FC",
                "name_my": null,
                "name_sk": "Arsenal FC",
                "name_rs": null,
                "name_ua": null,
                "name_bg": "Arsenal FC",
                "name_lv": null,
                "name_ge": null,
                "name_swa": null,
                "name_kur": null,
                "name_ee": null,
                "name_lt": null,
                "name_ba": null,
                "name_by": null,
                "name_fi": "Arsenal FC",
                "women": null,
                "parent_url": null,
                "prediction_risk": 0
            },
            "stadium_name": "Emirates Stadium",
            "stadium_address": "Queensland Road, London"
        }
    ]
}
Queries and Parameters
Variable Name
Description
id
ID of the Team.
name / full_name / english_name
Name of the Team.
country
Country of the Team.
stats
Contains an array of Stats for the corresponding team.
competition_id
ID of the Competition in which the team is playing.
url
Corresponding FootyStats url.
founded
Foundation year of the team.
season
Latest season participating in.
table_position
Position in the league.
performance_rank
PPG rating within the league.
season_format
Format of the season.
official_sites
Official website url of the team.
risk
Prediction risk, it represents how often a team scores or concedes goals within close proximity of each other.
suspended_matches
Number of matches suspended.
homeOverallAdvantage / homeDefenceAdvantage / homeAttackAdvantage
Advantage this team has in attack.
Overall = all games, home = home games only, away = away games only.
seasonGoals_overall
Number of goals scored this season.
seasonConceded_overall
Number of goals conceded this season.
seasonGoalsTotal_overall / home / away
Number of goal event recorded when playing Home or Away.
Overall = all games, home = home games only, away = away games only.
seasonConcededNum_home / seasonConcededNum_away
Number of goals conceded this season.
Home = home games only, away = away games only.
seasonGoalsMin_overall / home / away
Average goals per minutes.
Overall = all games, home = home games only, away = away games only.
seasonConcededMin_overall / home / away
Average goals conceded per minutes.
Overall = all games, home = home games only, away = away games only.
seasonGoalDifference_overall / home / away
Goal difference.
Overall = all games, home = home games only, away = away games only.
seasonWinsNum_overall / home / away
Number of wins in the season.
Overall = all games, home = home games only, away = away games only.
seasonDrawsNum_overall / home / away
Number of draws in the season.
Overall = all games, home = home games only, away = away games only.
seasonLossesNum_overall / home / away
Number of losses in the season.
Overall = all games, home = home games only, away = away games only.
seasonMatchesPlayed_overall / home / away
Number of match played in the season.
Overall = all games, home = home games only, away = away games only.
seasonHighestScored_home / seasonHighestScored_away
Highest number of goals scored.
Home = home games only, away = away games only.
seasonHighestConceded_home / seasonHighestConceded_away
Highest number of goals conceded.
Home = home games only, away = away games only.
seasonCS_overall / home / away
Season's clean sheets.
Overall = all games, home = home games only, away = away games only.
seasonCSPercentage_overall / home / away
Season's clean sheets percentage.
Overall = all games, home = home games only, away = away games only.
seasonCSHT_overall / home / away
Season's clean sheets at half-time.
Overall = all games, home = home games only, away = away games only.
seasonCSPercentageHT_overall / home / away
Season's clean sheets percentage at half-time.
Overall = all games, home = home games only, away = away games only.
seasonFTS_overall / home / away
Season's Failed To Score.
Overall = all games, home = home games only, away = away games only.
seasonFTSPercentage_overall / home / away
Season's Failed To Score percentage.
Overall = all games, home = home games only, away = away games only.
seasonFTS_home / seasonFTS_away
Season's first to score.
Home = home games only, away = away games only.
seasonFTSHT_overall / home / away
Season's Failed to score at half-time.
Overall = all games, home = home games only, away = away games only.
seasonFTSPercentageHT_overall / home / away
Season's Failed to score at half-time percentage.
Overall = all games, home = home games only, away = away games only.
seasonBTTS_overall / home / away
Season's both teams to score.
Overall = all games, home = home games only, away = away games only.
seasonBTTSPercentage_overall / home / away
Season's both teams to score percentage.
Overall = all games, home = home games only, away = away games only.
seasonBTTSHT_overall / home / away
Season's both teams to score at half-time.
Overall = all games, home = home games only, away = away games only.
seasonBTTSPercentageHT_overall / home / away
Season's both teams to score at half-time percentage.
Overall = all games, home = home games only, away = away games only.
seasonPPG_overall / home / away
Season's points per game, Win = 3 points, Draw = 1 point.
Overall = all games, home = home games only, away = away games only.
seasonAVG_overall / home / away
Season's average goals scored + conceded per game.
Overall = all games, home = home games only, away = away games only.
seasonAVG_overall / home / away
Season's average goals scored per game.
Overall = all games, home = home games only, away = away games only.
seasonConcededAVG_overall / home / away
Season's average goals conceded per game.
Overall = all games, home = home games only, away = away games only.
winPercentage_overall / home / away
Season's average win percentage.
Overall = all games, home = home games only, away = away games only.
drawPercentage_overall / home / away
Season's average draw percentage.
Overall = all games, home = home games only, away = away games only.
losePercentage_overall / home / away
Season's average loss percentage.
Overall = all games, home = home games only, away = away games only.
leadingAtHT_overall / home / away
Season's leading at half-time count.
Overall = all games, home = home games only, away = away games only.
leadingAtHTPercentage_overall / home / away
Season's leading at half-time percentage.
Overall = all games, home = home games only, away = away games only.
drawingAtHT_overall / home / away
Season's drawing at half-time.
Overall = all games, home = home games only, away = away games only.
drawingAtHTPercentage_overall / home / away
Season's drawing at half-time percentage.
Overall = all games, home = home games only, away = away games only.
trailingAtHT_overall / home / away
Season's losing at half-time.
Overall = all games, home = home games only, away = away games only.
trailingAtHTPercentage_overall / home / away
Season's losing at half-time percentage.
Overall = all games, home = home games only, away = away games only.
HTPoints_overall / home / away
Season's half-time points.
Overall = all games, home = home games only, away = away games only.
HTPPG_overall / home / away
Season's half-time points per game.
Overall = all games, home = home games only, away = away games only.
scoredAVGHT_overall / home / away
Season's average scored at half-time.
Overall = all games, home = home games only, away = away games only.
concededAVGHT_overall / home / away
Season's average conceded at half-time.
Overall = all games, home = home games only, away = away games only.
AVGHT_overall / home / away
Season's average scored + conceded at half-time.
Overall = all games, home = home games only, away = away games only.
GoalsHT_overall / home / away
Season's average goals at half-time.
Overall = all games, home = home games only, away = away games only.
GoalDifferenceHT_overall / home / away
Season's average goal difference at half-time.
Overall = all games, home = home games only, away = away games only.
seasonOver05Num_overall - seasonOver55Num_overall / home / away
Season's count of Over (0.5 - 5.5) goals.
Overall = all games, home = home games only, away = away games only.
seasonOver05Percentage_overall - seasonOver55Percentage_overall / home / away
Season's percentage of Over (0.5 - 5.5) goals.
Overall = all games, home = home games only, away = away games only.
seasonUnder05Num_overall - seasonUnder55Num_overall / home / away
Season's count of Under (0.5 - 5.5) goals.
Overall = all games, home = home games only, away = away games only.
seasonUnder05Percentage_overall - seasonUnder55Percentage_overall / home / away
Season's percentage of Under (0.5 - 5.5) goals.
Overall = all games, home = home games only, away = away games only.
seasonOver05NumHT_overall - seasonOver25NumHT_overall / home / away
Season's count of Over (0.5 - 5.5) goals at half time.
Overall = all games, home = home games only, away = away games only.
seasonOver05PercentageHT_overall - seasonOver25PercentageHT_overall / home / away
Season's percentage of Over (0.5 - 5.5) goals at half time.
Overall = all games, home = home games only, away = away games only.
cornersRecorded_matches_overall / home / away
Season's corners recorded per matches.
Overall = all games, home = home games only, away = away games only.
over65Corners_overall - over135Corners_overall / home / away
Season's count of Over (6.5 - 13.5) corners.
Overall = all games, home = home games only, away = away games only.
over65CornersPercentage_overall - over135CornersPercentage_overall / home / away
Season's percentage of Over (6.5 - 13.5) corners.
Overall = all games, home = home games only, away = away games only.
over25CornersFor_overall - over85CornersFor_overall / home / away
Season's count of Over (2.5 - 8.5) corners for.
Overall = all games, home = home games only, away = away games only.
over25CornersForPercentage_overall - over65CornersForPercentage_overall / home / away
Season's percentage of Over (2.5 - 8.5) corners for.
Overall = all games, home = home games only, away = away games only.
over25CornersAgainst_overall - over85CornersAgainst_overall / home / away
Season's count of Over (2.5 - 8.5) corners against.
Overall = all games, home = home games only, away = away games only.
over25CornersAgainstPercentage_overall - over65CornersAgainstPercentage_overall / home / away
Season's percentage of Over (2.5 - 8.5) corners against.
Overall = all games, home = home games only, away = away games only.
over05Cards_overall - over85Cards_overall / ohome / away
Season's count of Over (0,5 - 8.5) cards.
Overall = all games, home = home games only, away = away games only.
over05CardsPercentage_overall - over85CardsPercentage_overall / home / away
Season's percentage of Over (0,5 - 8.5) cards.
Overall = all games, home = home games only, away = away games only.
over05CardsFor_overall - over85CardsFor_overall / home / away
Season's count of Over (0,5 - 8.5) cards for.
Overall = all games, home = home games only, away = away games only.
over05CardsForPercentage_overall - over85CardsForPercentage_overall / home / away
Season's percentage of Over (0,5 - 8.5) cards for.
Overall = all games, home = home games only, away = away games only.
over05CardsAgainst_overall - over85CardsAgainst_overall / home / away
Season's count of Over (0,5 - 8.5) cards for.
Overall = all games, home = home games only, away = away games only.
over05CardsAgainstPercentage_overall - over85CardsAgainstPercentage_overall / home / away
Season's percentage of Over (0,5 - 8.5) cards for.
Overall = all games, home = home games only, away = away games only.
leaguePosition_overall / home / away
Season's league position.
Overall = normal league table, home = home table only, away = away table only.
firstGoalScored_overall / home / away
Season's count of first goals scored.
Overall = all games, home = home games only, away = away games only.
firstGoalScoredPercentage_overall / home / away
Season's percentage of first goals scored.
Overall = all games, home = home games only, away = away games only.
cornersTotal_overall / home / away
Season's count of corners.
Overall = all games, home = home games only, away = away games only.
cornersTotalAVG_overall / home / away
Season's average count of corners per match.
Overall = all games, home = home games only, away = away games only.
cornersAVG_overall / home / away
Season's average count of corners.
Overall = all games, home = home games only, away = away games only.
cardsTotal_overall / home / away
Season's count of cards.
Overall = all games, home = home games only, away = away games only.
cardsAVG_overall / home / away
Season's count of cards.
Overall = all games, home = home games only, away = away games only.
cornersHighest_overall / cornersLowest_overall
Season's Highest / Lowest corner counts.
cornersAgainst_overall / home / away
Season's corners against.
Overall = all games, home = home games only, away = away games only.
cornersAgainstAVG_overall / home / away
Season's average corners against.
Overall = all games, home = home games only, away = away games only.
shotsTotal_overall / home / away
Season's shots.
Overall = all games, home = home games only, away = away games only.
shotsAVG_overall / home / away
Season's shots.
Overall = all games, home = home games only, away = away games only.
shotsOnTargetTotal_overall / home / away
Season's shots on target.
Overall = all games, home = home games only, away = away games only.
shotsOffTargetTotal_overall / home / away
Season's shots off target.
Overall = all games, home = home games only, away = away games only.
shotsOnTargetAVG_overall / home / away
Season's shots on target average.
Overall = all games, home = home games only, away = away games only.
shotsOffTargetAVG_overall / home / away
Season's shots off target average.
Overall = all games, home = home games only, away = away games only.
possessionAVG_overall / home / away
Season's possession average.
Overall = all games, home = home games only, away = away games only.
foulsAVG_overall / home / away
Season's fouls average.
Overall = all games, home = home games only, away = away games only.
foulsTotal_overall / fhome / away
Season's total fouls.
Overall = all games, home = home games only, away = away games only.
offsidesTotal_overall / home / away
Season's total offsides.
Overall = all games, home = home games only, away = away games only.
offsidesTeamTotal_overall / home / away
Season's total team offsides.
Overall = all games, home = home games only, away = away games only.
offsidesRecorded_matches_overall / home / away
Season's offsides recorded per match.
Overall = all games, home = home games only, away = away games only.
offsidesAVG_overall / home / away
Season's average offsides.
Overall = all games, home = home games only, away = away games only.
offsidesTeamAVG_overall / home / away
Season's team average offsides.
Overall = all games, home = home games only, away = away games only.
offsidesOver05_overall - offsidesOver65_overall / home / away
Season's count of Over (0,5 - 6.5) offsides.
Overall = all games, home = home games only, away = away games only.
over05OffsidesPercentage_overall - over65OffsidesPercentage_overall / home / away
Season's percentage of Over (0,5 - 6.5) offsides.
Overall = all games, home = home games only, away = away games only.
offsidesTeamOver05_overall - offsidesTeamOver65_overall / home / away
Season's count of Over (0,5 - 6.5) Team offsides.
Overall = all games, home = home games only, away = away games only.
over05OffsidesTeamPercentage_overall - over65OffsidesTeamPercentage_overall / home / away
Season's percentage of Over (0,5 - 6.5) Team offsides.
Overall = all games, home = home games only, away = away games only.
scoredBothHalves_overall / home / away
Season's scored in both halves.
Overall = all games, home = home games only, away = away games only.
scoredBothHalvesPercentage_overall / home / away
Season's scored in both halves percentage.
Overall = all games, home = home games only, away = away games only.
seasonMatchesPlayedGoalTimingRecorded_overall / home / away
Season's matches played goal timing recorded.
Overall = all games, home = home games only, away = away games only.
BTTS_and_win_overall / home / away
Season's both teams to score and win count.
Overall = all games, home = home games only, away = away games only.
BTTS_and_win_percentage_overall / home / away
Season's both teams to score and win percentage.
Overall = all games, home = home games only, away = away games only.
BTTS_and_draw_overall / home / away
Season's both teams to score and draw count.
Overall = all games, home = home games only, away = away games only.
BTTS_and_draw_percentage_overall / home / away
Season's both teams to score and draw percentage.
Overall = all games, home = home games only, away = away games only.
BTTS_and_lose_overall / home / away
Season's both teams to score and lose count.
Overall = all games, home = home games only, away = away games only.
BTTS_and_lose_percentage_overall / home / away
Season's both teams to score and lose percentage.
Overall = all games, home = home games only, away = away games only.
AVG_2hg_overall / home / away
Average second half total goals.
Overall = all games, home = home games only, away = away games only.
scored_2hg_avg_overall / home / away
Average second half goals scored.
Overall = all games, home = home games only, away = away games only.
conceded_2hg_avg_overall / home / away
Average second half goals conceded.
Overall = all games, home = home games only, away = away games only.
total_2hg_overall / home / away
Total second half goals.
Overall = all games, home = home games only, away = away games only.
conceded_2hg_overall / home / away
Total second half goals conceded.
Overall = all games, home = home games only, away = away games only.
scored_2hg_overall / home / away
Total second half goals scored.
Overall = all games, home = home games only, away = away games only.
over05_2hg_num_overall - over25_2hg_num_overall / home / away
Season's count of Over (0,5 - 2.5) second half goals.
Overall = all games, home = home games only, away = away games only.
over05_2hg_percentage_overall - over25_2hg_percentage_overall / home / away
Season's percentage of Over (0,5 - 2.5) second half goals.
Overall = all games, home = home games only, away = away games only.
points_2hg_overall / home / away
Season's points gained in second half.
Overall = all games, home = home games only, away = away games only.
ppg_2hg_overall / home / away
Season's point per game in second half.
Overall = all games, home = home games only, away = away games only.
wins_2hg_overall / home / away
Season's wins in second half.
Overall = all games, home = home games only, away = away games only.
wins_2hg_percentage_overall / home / away
Season's wins percentage in second half.
Overall = all games, home = home games only, away = away games only.
draws_2hg_overall / home / away
Season's draws in second half.
Overall = all games, home = home games only, away = away games only.
draws_2hg_percentage_overall / home / away
Season's draws percentage in second half.
Overall = all games, home = home games only, away = away games only.
losses_2hg_overall / home / away
Season's loses in second half.
Overall = all games, home = home games only, away = away games only.
losses_2hg_percentage_overall / home / away
Season's losses percentage in second half.
Overall = all games, home = home games only, away = away games only.
gd_2hg_overall / home / away
Season's goal difference in second half.
Overall = all games, home = home games only, away = away games only.
btts_2hg_overall / home / away
Season's both teams to score in second half.
Overall = all games, home = home games only, away = away games only.
btts_2hg_percentage_overall / home / away
Season's percentage of both teams to score in second half.
Overall = all games, home = home games only, away = away games only.
btts_fhg_overall / home / away
Season's both teams to score in first half.
Overall = all games, home = home games only, away = away games only.
btts_fhg_percentage_overall / home / away
Season's percentage of both teams to score in first half.
Overall = all games, home = home games only, away = away games only.
cs_2hg_overall / home / away
Season's clean sheets in second half.
Overall = all games, home = home games only, away = away games only.
cs_2hg_percentage_overall / home / away
Season's clean sheets percentage in second half.
Overall = all games, home = home games only, away = away games only.
fts_2hg_overall / home / away
Season's first to score in second half.
Overall = all games, home = home games only, away = away games only.
fts_2hg_percentage_overall / home / away
Season's first to score percentage in second half.
Overall = all games, home = home games only, away = away games only.
BTTS_both_halves_overall / home / away
Season's both teams to score in both halves.
Overall = all games, home = home games only, away = away games only.
BTTS_both_halves_percentage_overall / home / away
Season's both teams to score percentage in both halves.
Overall = all games, home = home games only, away = away games only.
average_attendance_overall / home / away
Season's average attendance.
Overall = all games, home = home games only, away = away games only.
cornerTimingRecorded_matches_overall / home / away
Timing of the corners recorded.
Overall = all games, home = home games only, away = away games only.
corners_fh_overall / home / away
Seasons first half corners.
Overall = all games, home = home games only, away = away games only.
corners_2h_overall / home / away
Seasons second half corners.
Overall = all games, home = home games only, away = away games only.
corners_fh_avg_overall / home / away
Seasons first half corners.
Overall = all games, home = home games only, away = away games only.
corners_fh_over4_overall - corners_fh_over6_overall / home / away
Seasons Over (4 - 6) first half corners.
Overall = all games, home = home games only, away = away games only.
corners_2h_over4_overall - corners_2h_over6_overall / home / away
Seasons Over (4 - 6) second half corners.
Overall = all games, home = home games only, away = away games only.
corners_fh_over4_percentage_overall - corners_fh_over6_percentage_overall / home / away
Seasons Over (4 - 6) first half corners.
Overall = all games, home = home games only, away = away games only.
corners_2h_over4_percentage_overall - corners_2h_over6_percentage_overall / home / away
Seasons Over (4 - 6) second half corners.
Overall = all games, home = home games only, away = away games only.
attack_num_recoded_matches_overall / home / away
Season's count of attacks recorded per match.
Overall = all games, home = home games only, away = away games only.
dangerous_attacks_avg_overall / home / away
Season's count of dangerous attacks recorder per match.
Overall = all games, home = home games only, away = away games only.
xg_for_overall / home / away
Season's average xg for average.
Overall = all games, home = home games only, away = away games only.
xg_for_avg_overall / home / away
Season's average xg for average.
Overall = all games, home = home games only, away = away games only.
xg_against_avg_overall / home / away
Season's average xg against average.
Overall = all games, home = home games only, away = away games only.
attacks_num_overall / home / away
Number of attacks.
Overall = all games, home = home games only, away = away games only.
seasonScoredOver05Num_overall - seasonScoredOver35Num_overall / home / away
Seasons Over (0.5 - 3.5) scored.
Overall = all games, home = home games only, away = away games only.
seasonScoredOver05PercentageNum_overall - seasonScoredOver35PercentageNum_overall / home / away
Seasons percentage of Over (0.5 - 3.5) scored.
Overall = all games, home = home games only, away = away games only.
seasonConcededOver05Num_overall - seasonConcededOver35Num_overall / home / away
Seasons Over (0.5 - 3.5) Conceded.
Overall = all games, home = home games only, away = away games only.
seasonConcededOver05PercentageNum_overall - seasonConcededOver35PercentageNum_overall / home / away
Seasons percentage of Over (0.5 - 3.5) Conceded.
Overall = all games, home = home games only, away = away games only.
cardTimingRecorded_matches_overall / home / away
Cards timing recorded in match.
Overall = all games, home = home games only, away = away games only.
cardsRecorded_matches_overall / home / away
Cards recorded in match.
Overall = all games, home = home games only, away = away games only.
fh_cards_total_overall / home / away
First half cards total.
Overall = all games, home = home games only, away = away games only.
2h_cards_total_overall / home / away
Second half cards total.
Overall = all games, home = home games only, away = away games only.
fh_cards_for_total_overall / home / away
First half cards for total.
Overall = all games, home = home games only, away = away games only.
2h_cards_for_total_overall / home / away
Second half cards for total.
Overall = all games, home = home games only, away = away games only.
fh_cards_against_total_overall / home / away
First half cards against total.
Overall = all games, home = home games only, away = away games only.
2h_cards_against_total_overall / home / away
Second half cards against total.
Overall = all games, home = home games only, away = away games only.
fh_total_cards_under2_percentage_overall / home / away
First half total cards under 2 percentage.
Overall = all games, home = home games only, away = away games only.
2h_total_cards_under2_percentage_overall / home / away
Second half total cards under 2 percentage.
Overall = all games, home = home games only, away = away games only.
fh_total_cards_2to3_percentage_overall / home / away
First half total cards 2 to 3 percentage.
Overall = all games, home = home games only, away = away games only.
2h_total_cards_2to3_percentage_overall / home / away
Second half total cards 2 to 3 percentage.
Overall = all games, home = home games only, away = away games only.
fh_total_cards_over3_percentage_overall / fhome / away
First half total cards over 3 percentage.
Overall = all games, home = home games only, away = away games only.
2h_total_cards_over3_percentage_overall / home / away
Second half total cards over 3 percentage.
Overall = all games, home = home games only, away = away games only.
fh_half_with_most_cards_total_percentage_overall / home / away
First half with most cards total percentage.
Overall = all games, home = home games only, away = away games only.
2h_half_with_most_cards_total_percentage_overall / home / away
Second half with most cards total percentage.
Overall = all games, home = home games only, away = away games only.
fh_cards_for_over05_percentage_overall / home / away
First half cards for the team, Over 0.5.
Overall = all games, home = home games only, away = away games only.
2h_cards_for_over05_percentage_overall / home / away
Second half cards for the team, Over 0.5.
Overall = all games, home = home games only, away = away games only.
cards_for_overall / home / away
Cards for overall.
Overall = all games, home = home games only, away = away games only.
cards_against_overall / home / away
Cards against overall.
Overall = all games, home = home games only, away = away games only.
cards_for_avg_overall / home / away
Average cards for overall.
Overall = all games, home = home games only, away = away games only.
cards_against_avg_overall / home / away
Average cards against overall.
Overall = all games, home = home games only, away = away games only.
cards_total_overall / home / away
Total cards.
Overall = all games, home = home games only, away = away games only.
cards_total_avg_overall / home / away
Average total cards.
Overall = all games, home = home games only, away = away games only.
penalties_won_overall / home / away
Penatlies won.
Overall = all games, home = home games only, away = away games only.
penalties_scored_overall / home / away
Penatlies scored.
Overall = all games, home = home games only, away = away games only.
penalties_missed_overall / home / away
Penalties missed.
Overall = all games, home = home games only, away = away games only.
penalties_won_per_match_overall / home / away
Penalties won per match.
Overall = all games, home = home games only, away = away games only.
penalties_recorded_matches_overall / home / away
Penalties recorded per match.
Overall = all games, home = home games only, away = away games only.
exact_team_goals_0_ft_overall - exact_team_goals_3_ft_overall / home / away
Number of times the team scored exactly (0 - 3) goals at full time.
Overall = all games, home = home games only, away = away games only.
match_shots_over225_num_overall - match_shots_over265_num_overall / home / away
Count of match shots Over (22.5 - 26.5).
Overall = all games, home = home games only, away = away games only.
match_shots_over225_percentage_overall - match_shots_over265_percentage_overall / home / away
Percentage of match shots Over (22.5 - 26.5).
Overall = all games, home = home games only, away = away games only.
match_shots_on_target_over75_num_overall - match_shots_on_target_over95_num_overall / home / away
Number of match shots Over (7.5 - 9.5).
Overall = all games, home = home games only, away = away games only.
match_shots_on_target_over75_percentage_overall - match_shots_on_target_over95_percentage_overall / home / away
Percentage of match shots Over (7.5 - 9.5).
Overall = all games, home = home games only, away = away games only.
team_shots_over105_num_overall - team_shots_over155_num_overall / home / away
Number of team shots Over (10.5 - 15.5).
Overall = all games, home = home games only, away = away games only.
team_shots_over105_percentage_overall - team_shots_over155_percentage_overall / home / away
Percentage of team shots Over (10.5 - 15.5).
Overall = all games, home = home games only, away = away games only.
team_shots_on_target_over35_num_overall - team_shots_on_target_over65_num_overall / home / away
Number of team shots on target Over (3.5 - 6.5).
Overall = all games, home = home games only, away = away games only.
team_shots_on_target_over35_percentage_overall - team_shots_on_target_over65_percentage_overall / home / away
Percentage of team shots on target Over (3.5 - 6.5).
Overall = all games, home = home games only, away = away games only.
win_0_10_num_overall / home / away
Win count between minute 0 and 10, this parameter does not inherit the score of the game and focuses only on the first 0 to 10 minutes.
Overall = all games, home = home games only, away = away games only.
draw_0_10_num_overall / home / away
Draw count between minute 0 and 10, this parameter does not inherit the score of the game and focuses only on the first 0 to 10 minutes.
Overall = all games, home = home games only, away = away games only.
loss_0_10_num_overall / home / away
Loss count between minute 0 and 10, this parameter does not inherit the score of the game and focuses only on the first 0 to 10 minutes.
Overall = all games, home = home games only, away = away games only.
win_0_10_percentage_overall / home / away
Win percentage between minute 0 and 10, this parameter does not inherit the score of the game and focuses only on the first 0 to 10 minutes.
Overall = all games, home = home games only, away = away games only.
draw_0_10_percentage_overall / home / away
Draw percentage between minute 0 and 10, this parameter does not inherit the score of the game and focuses only on the first 0 to 10 minutes.
Overall = all games, home = home games only, away = away games only.
loss_0_10_percentage_overall / home / away
Loss percentage between minute 0 and 10, this parameter does not inherit the score of the game and focuses only on the first 0 to 10 minutes.
Overall = all games, home = home games only, away = away games only.
total_goal_over05_0_10_num_overall / home / away
Count of over 0.5 goals between minute 0 and 10.
Overall = all games, home = home games only, away = away games only.
total_corner_over05_0_10_num_overall / home / away
Count of over 0.5 corners between minute 0 and 10.
Overall = all games, home = home games only, away = away games only.
total_goal_over05_0_10_percentage_overall / home / away
Percentage of over 0.5 goals between minute 0 and 10.
Overall = all games, home = home games only, away = away games only.
total_corner_over05_0_10_percentage_overall / home / away
Percentage of over 0.5 corners between minute 0 and 10.
Overall = all games, home = home games only, away = away games only.
fouls_recorded_overall / home / away
Fouls recorded.
Overall = all games, home = home games only, away = away games only.
fouls_against_num_overall / home / away
Fouls against recorded.
Overall = all games, home = home games only, away = away games only.
fouls_against_avg_overall / home / away
Average fouls against recorded.
Overall = all games, home = home games only, away = away games only.
exact_team_goals_0_ft_percentage_overall - exact_team_goals_3_ft_percentage_overall / home / away
Percentage of (0 - 3) exact team goals.
Overall = all games, home = home games only, away = away games only.
exact_total_goals_0_ft_overall - exact_total_goals_7_ft_overall / home / away
Percentage of (0 - 7) exact team goals.
Overall = all games, home = home games only, away = away games only.
shots_recorded_matches_num_overall / home / away
Number of shots recorded per matches.
Overall = all games, home = home games only, away = away games only.
over25_and_btts_num_overall / home / away
Count of over 2.5 and BTTS.
Overall = all games, home = home games only, away = away games only.
over25_and_no_btts_num_overall / home / away
Count of over 2.5 and NO BTTS.
Overall = all games, home = home games only, away = away games only.
over25_and_btts_percentage_overall / home / away
Percentage of over 2.5 and BTTS.
Overall = all games, home = home games only, away = away games only.
over25_and_no_btts_percentage_overall / home / away
Percentage of over 2.5 and NO BTTS.
Overall = all games, home = home games only, away = away games only.
btts_1h2h_yes_yes_num_overall / home / away
Count of BTTS first half yes & BTTS second half yes.
Overall = all games, home = home games only, away = away games only.
btts_1h2h_yes_no_num_overall / home / away
Count of BTTS first half yes & BTTS second half no.
Overall = all games, home = home games only, away = away games only.
btts_1h2h_no_no_num_overall / home / away
Count of BTTS first half no & BTTS second half no.
Overall = all games, home = home games only, away = away games only.
btts_1h2h_no_yes_num_overall / home / away
Count of BTTS first half no & BTTS second half yes.
Overall = all games, home = home games only, away = away games only.
btts_1h2h_yes_yes_percentage_overall / home / away
Percentage of BTTS first half yes & BTTS second half yes.
Overall = all games, home = home games only, away = away games only.
btts_1h2h_yes_no_percentage_overall / home / away
Percentage of BTTS first half yes & BTTS second half no.
Overall = all games, home = home games only, away = away games only.
btts_1h2h_no_no_percentage_overall / home / away
Percentage of BTTS first half no & BTTS second half no.
Overall = all games, home = home games only, away = away games only.
btts_1h2h_no_yes_percentage_overall / home / away
Percentage of BTTS first half no & BTTS second half yes.
Overall = all games, home = home games only, away = away games only.
half_with_most_goals_is_1h_num_overall / home / away
Number of times the half with most goals was the 1st half.
Overall = all games, home = home games only, away = away games only.
half_with_most_goals_is_tie_num_overall / home / away
Number of times the half with most goals was a tie between 1st and 2nd half.
Overall = all games, home = home games only, away = away games only.
half_with_most_goals_is_2h_num_overall / home / away
Number of times the half with most goals was the 2nd half.
Overall = all games, home = home games only, away = away games only.
half_with_most_goals_is_1h_percentage_overall / home / away
Percentage of times the half with most goals was the 1st half.
Overall = all games, home = home games only, away = away games only.
half_with_most_goals_is_tie_percentage_overall / home / away
Percentage of times the half with most goals was a tie between 1st and 2nd half.
Overall = all games, home = home games only, away = away games only.
half_with_most_goals_is_2h_percentage_overall / home / away
Percentage of times the half with most goals was the 2nd half.
Overall = all games, home = home games only, away = away games only.
shot_conversion_rate_overall / home / away
Shot conversion rate.
Overall = all games, home = home games only, away = away games only.
team_with_most_corners_win_num_overall / home / away
Number of times the team had the most corners.
Overall = all games, home = home games only, away = away games only.
team_with_most_corners_win_1h_num_overall / home / away
Number of times the team had the most corners in 1st half.
Overall = all games, home = home games only, away = away games only.
team_with_most_corners_win_2h_num_overall / home / away
Number of times the team had the most corners in 2nd half.
Overall = all games, home = home games only, away = away games only.
team_with_most_corners_win_percentage_overall / home / away
Percentage of times the team had the most corners in the match.
Overall = all games, home = home games only, away = away games only.
team_with_most_corners_win_1h_percentage_overall / home / away
Percentage of times the team had the most corners in 1st half.
Overall = all games, home = home games only, away = away games only.
team_with_most_corners_win_2h_percentage_overall / home / away
Percentage of times the team had the most corners in 2nd half.
Overall = all games, home = home games only, away = away games only.
corners_earned_1h_num_overall / home / away
Total number of 1st half corner kicks that this team earned this season in this competition.
Overall = all games, home = home games only, away = away games only.
corners_earned_2h_num_overall / home / away
Total number of 2nd half corner kicks that this team earned this season in this competition.
Overall = all games, home = home games only, away = away games only.
corners_earned_1h_avg_overall / home / away
Average number of 1st half corner kicks per match that this team earned this season in this competition. Average = total number divided number of matches.
Overall = all games, home = home games only, away = away games only.
corners_earned_2h_avg_overall / home / away
Average number of 2nd half corner kicks per match that this team earned this season in this competition. Average = total number divided number of matches.
Overall = all games, home = home games only, away = away games only.
corners_earned_1h_over2_num_overall / home / away
Number of times this team has earned more than 2 corner kicks in the 1st half this season.
Overall = all games, home = home games only, away = away games only.
corners_earned_2h_over2_num_overall / home / away
Number of times this team has earned more than 2 corner kicks in the 2nd half this season.
Overall = all games, home = home games only, away = away games only.
corners_earned_1h_over3_num_overall / home / away
Number of times this team has earned more than 3 corner kicks in the 1st half this season.
Overall = all games, home = home games only, away = away games only.
corners_earned_2h_over3_num_overall / home / away
Number of times this team has earned more than 3 corner kicks in the 2nd half this season.
Overall = all games, home = home games only, away = away games only.
corners_earned_1h_2_to_3_num_overall / home / away
Number of times this team has earned 2 or 3 corner kicks in the 1st half this season.
Overall = all games, home = home games only, away = away games only.
corners_earned_2h_2_to_3_num_overall / home / away
Number of times this team has earned 2 or 3 corner kicks in the 2nd half this season.
Overall = all games, home = home games only, away = away games only.
corners_earned_1h_over2_percentage_overall / home / away
Percentage of matches this team has earned more than 2 corner kicks in the 1st half this season.
Overall = all games, home = home games only, away = away games only. Percentage calculation = number of matches of Over 2 corners in 1st half divided by number of matches this team played where corner timings were recorded.
corners_earned_2h_over2_percentage_overall / home / away
Percentage of matches this team has earned more than 2 corner kicks in the 2nd half this season.
Overall = all games, home = home games only, away = away games only. Percentage calculation = number of matches of Over 2 corners in 2nd half divided by number of matches this team played where corner timings were recorded.
corners_earned_1h_over3_percentage_overall / home / away
Percentage of matches this team has earned more than 3 corner kicks in the 1st half this season.
Overall = all games, home = home games only, away = away games only. Percentage calculation = number of matches of Over 3 corners in 1st half divided by number of matches this team played where corner timings were recorded.
corners_earned_2h_over3_percentage_overall / home / away
Percentage of matches this team has earned more than 3 corner kicks in the 2nd half this season.
Overall = all games, home = home games only, away = away games only. Percentage calculation = number of matches of Over 3 corners in 2nd half divided by number of matches this team played where corner timings were recorded.
corners_earned_1h_2_to_3_percentage_overall / home / away
Percentage of matches this team has earned 2 or 3 corner kicks in the 1st half this season.
Overall = all games, home = home games only, away = away games only. Percentage calculation = number of matches of 2 to 3 corners in 1st half divided by number of matches this team played where corner timings were recorded.
corners_earned_2h_2_to_3_percentage_overall / home / away
Percentage of matches this team has earned 2 or 3 corner kicks in the 2nd half this season.
Overall = all games, home = home games only, away = away games only. Percentage calculation = number of matches of 2 to 3 corners in 2nd half divided by number of matches this team played where corner timings were recorded.
penalties_conceded_overall / home / away
Penalty kicks conceded by this team this season.
penalty_in_a_match_overall / home / away
Number of matches where there was at least 1 penalty kick by either team this season.
penalty_in_a_match_percentage_overall / home / away
Percentage of matches where there was at least 1 penalty kick by either team this season.
goal_kicks_recorded_matches_overall / home / away
Number of matches where goal kicks were recorded this season.
goal_kicks_team_num_overall / home / away
Number of goal kicks by this team this season.
goal_kicks_total_num_overall / home / away
Number of total goal kicks by both teams this season.
goal_kicks_team_avg_overall / home / away
Average number of goal kicks per match by this teams this season.
goal_kicks_total_avg_overall / home / away
Average number of total goal kicks per match by both teams this season.
goal_kicks_team_over35_overall ~ goal_kicks_team_over115_overall / home / away
Number of matches where this team performed Over 3.5 ~ Over 11.5 goal kicks this season.
goal_kicks_total_over85_overall ~ goal_kicks_total_over185_overall / home / away
Number of matches where both teams in total performed Over 8.5 ~ Over 18.5 goal kicks this season.
throwins_recorded_matches_overall / home / away
Number of matches where throw-ins were recorded this season.
throwins_team_num_overall / home / away
Number of throw-ins by this team this season.
throwins_total_num_overall / home / away
Number of total throw-ins by both teams this season.
throwins_team_avg_overall / home / away
Average number of throw-ins per match by this teams this season.
throwins_total_avg_overall / home / away
Average number of total throw-ins per match by both teams this season.
throwins_team_over155_overall ~ throwins_team_over245_overall / home / away
Number of matches where this team performed Over 15.5 ~ Over 24.5 goal throw-ins this season.
goals_scored_min_0_to_10 - goals_scored_min_81_to_90
Number of goals scored during this time period. This season
goals_conceded_min_0_to_10 - goals_conceded_min_81_to_90
Number of goals conceded during this time period. This season
goals_all_min_0_to_10 - goals_all_min_81_to_90
Number of goals scored and conceded during this time period. This season. This is in 10 minute increments.
goals_all_min_0_to_15 - goals_all_min_76_to_90
Number of goals scored and conceded during this time period. This season. This is in 15 minute increments.
goals_scored_min_0_to_15 - goals_scored_min_76_to_90
Number of goals scored during this time period. This season. This is in 15 minute increments.
goals_conceded_min_0_to_15 - goals_conceded_min_76_to_90
Number of goals conceded during this time period. This season. This is in 15 minute increments.
goals_scored_min_0_to_10_home - goals_scored_min_81_to_90_home / goals_scored_min_0_to_10_away - goals_scored_min_81_to_90_away
Number of goals scored during this time period. This season at home games only or away games only.
goals_scored_min_0_to_15_home - goals_scored_min_76_to_90_home / goals_scored_min_0_to_15_away - goals_scored_min_76_to_90_away
Number of goals scored during this time period. This season at home games only or away games only. This is in 15 minute increments.
goals_conceded_min_0_to_10_home - goals_conceded_min_81_to_90_home / goals_conceded_min_0_to_10_away - goals_conceded_min_81_to_90_away
Number of goals conceded during this time period. This season at home games only or at away games only.
goals_conceded_min_0_to_15_home - goals_conceded_min_76_to_90_home / goals_conceded_min_0_to_15_away - goals_conceded_min_76_to_90_away
Number of goals scored during this time period. This season at home games only or away games only. This is in 15 minute increments.
goals_all_min_0_to_10_home - goals_all_min_81_to_90_home / goals_all_min_0_to_10_away - goals_all_min_81_to_90_away
Number of goals scored and conceded during this time period. This season at home games only or away games only.
goals_all_min_0_to_15_home - goals_all_min_76_to_90_home / goals_all_min_0_to_15_away - goals_all_min_76_to_90_away
Number of goals scored and conceded during this time period. This season at home games only or at away games only. This is in 15 minute increments.
name_pt - name_fi
Name of the team in the following languages : Spanish, Portuguese, Korean, Turkish, Arabic, Japanese, Russian, German, Swedish, Chinese Traditional, Chinese Simplified, Greek, Polish, Thai, French, Croatian, Czech, Hungarian, Danish, Vietnamese, Slovakian, Bulgarian, Finnish. Not all languages are always available and may default to English depending on availability.
women
1 = Women's team. Null = Men's team
prediction_risk
Prediction Risk represents how often a team scores or concedes goals within close proximity of each other. For example - if Manchester United Scores a goal at min 55', and then concedes immediately at min 58', it will increase their Risk rating. The more times this happens across a single season, the more risk there is of unexpected goals occurring.



Team - Last 5 / 6 / 10 Stats
Last 5 matches, last 6 matches, or last 10 match stats for an individual team.

Get Last X stats for a team
GEThttps://api.football-data-api.com/lastx?key=4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756&team_id=*
Sample Response (Access the URL below)
https://api.football-data-api.com/lastx?key=4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756&team_id=59
1 query allows you to get all 3 types of stats (last 5 / 6 /10). We are adding last 15 and last 20 stats down the road.
Stats(attributes and properties) are identical to the stats from team endpoint.
Query Parameters
Name
Type
Description
key
*
string
Your API Key
team_id
*
integer
ID of the team that you would like to retrieve.
200 Successfully retrieved all leagues.Hide ↑Copy
{
    "success": true,
    "pager": {
        "current_page": 1,
        "max_page": 1,
        "results_per_page": 50,
        "total_results": 3
    },
    "data": [
        {
            "id": 59,
            "continent": null,
            "image": "https://cdn.footystats.org/img/teams/england-arsenal-fc.png",
            "season": "2020",
            "url": "https://footystats.org/clubs/england/arsenal-fc",
            "table_position": 0,
            "performance_rank": 0,
            "risk": 40,
            "season_format": "Domestic League",
            "competition_id": -1,
            "last_updated_match_timestamp": 1583593200,
            "last_x_home_away_or_overall": "0",
            "founded": "1886",
            "country": "England",
            "name": "Arsenal",
            "full_name": "Arsenal FC",
            "english_name": "Arsenal FC",
            "last_x_match_num": 5,
            "alt_names": [],
            "official_sites": {
                "Arsenal Fc Official Website": "https://www.arsenal.com/"
            },
            "stats": {
                "suspended_matches": 0,
                "homeAttackAdvantage": 4,
                "homeDefenceAdvantage": -65,
                "homeOverallAdvantage": -31,
                "seasonGoals_overall": 8,
                "seasonConceded_overall": 1,
                "seasonGoalsTotal_overall": 9,
                "seasonGoalsTotal_home": 6,
                "seasonGoalsTotal_away": 3,
                "seasonScoredNum_overall": 8,
                "seasonScoredNum_home": 5,
                "seasonScoredNum_away": 3,
                "seasonConcededNum_overall": 1,
                "seasonConcededNum_home": 1,
                "seasonConcededNum_away": 0,
                "seasonGoalsMin_overall": 50,
                "seasonGoalsMin_home": 45,
                "seasonGoalsMin_away": 60,
                "seasonScoredMin_overall": 56,
                "seasonScoredMin_home": 54,
                "seasonScoredMin_away": 60,
                "seasonConcededMin_overall": 450,
                "seasonConcededMin_home": 273,
                "seasonConcededMin_away": 0,
                "seasonGoalDifference_overall": 7,
                "seasonGoalDifference_home": 4,
                "seasonGoalDifference_away": 3,
                "seasonWinsNum_overall": 4,
                "seasonWinsNum_home": 3,
                "seasonWinsNum_away": 1,
                "seasonDrawsNum_overall": 1,
                "seasonDrawsNum_home": 0,
                "seasonDrawsNum_away": 1,
                "seasonLossesNum_overall": 0,
                "seasonLossesNum_home": 0,
                "seasonLossesNum_away": 0,
                "seasonMatchesPlayed_overall": 5,
                "seasonMatchesPlayed_away": 2,
                "seasonMatchesPlayed_home": 3,
                "seasonHighestScored_home": 2,
                "seasonHighestConceded_home": 1,
                "seasonHighestScored_away": 3,
                "seasonHighestConceded_away": 0,
                "seasonCS_overall": 4,
                "seasonCS_home": 2,
                "seasonCS_away": 2,
                "seasonCSPercentage_overall": 80,
                "seasonCSPercentage_home": 67,
                "seasonCSPercentage_away": 100,
                "seasonCSHT_overall": 4,
                "seasonCSHT_home": 2,
                "seasonCSHT_away": 2,
                "seasonCSPercentageHT_overall": 80,
                "seasonCSPercentageHT_home": 67,
                "seasonCSPercentageHT_away": 100,
                "seasonFTS_overall": 1,
                "seasonFTSPercentage_overall": 20,
                "seasonFTSPercentage_home": 0,
                "seasonFTSPercentage_away": 50,
                "seasonFTS_home": 0,
                "seasonFTS_away": 1,
                "seasonFTSHT_overall": 1,
                "seasonFTSPercentageHT_overall": 20,
                "seasonFTSPercentageHT_home": 0,
                "seasonFTSPercentageHT_away": 50,
                "seasonFTSHT_home": 0,
                "seasonFTSHT_away": 1,
                "seasonBTTS_overall": 1,
                "seasonBTTS_home": 1,
                "seasonBTTS_away": 0,
                "seasonBTTSPercentage_overall": 20,
                "seasonBTTSPercentage_home": 33,
                "seasonBTTSPercentage_away": 0,
                "seasonBTTSHT_overall": 1,
                "seasonBTTSHT_home": 1,
                "seasonBTTSHT_away": 0,
                "seasonBTTSPercentageHT_overall": 20,
                "seasonBTTSPercentageHT_home": 33,
                "seasonBTTSPercentageHT_away": 0,
                "seasonPPG_overall": 2.6,
                "seasonPPG_home": 3,
                "seasonPPG_away": 2,
                "seasonAVG_overall": 1.8,
                "seasonAVG_home": 2,
                "seasonAVG_away": 1.5,
                "seasonScoredAVG_overall": 1.6,
                "seasonScoredAVG_home": 1.67,
                "seasonScoredAVG_away": 1.5,
                "seasonConcededAVG_overall": 0.2,
                "seasonConcededAVG_home": 0.33,
                "seasonConcededAVG_away": 0,
                "winPercentage_overall": 80,
                "winPercentage_home": 100,
                "winPercentage_away": 50,
                "drawPercentage_overall": 20,
                "drawPercentage_home": 0,
                "drawPercentage_away": 50,
                "losePercentage_overall": 0,
                "losePercentage_home": 0,
                "losePercentage_away": 0,
                "leadingAtHT_overall": 3,
                "leadingAtHT_home": 2,
                "leadingAtHT_away": 1,
                "leadingAtHTPercentage_overall": 60,
                "leadingAtHTPercentage_home": 67,
                "leadingAtHTPercentage_away": 50,
                "drawingAtHT_home": 1,
                "drawingAtHT_away": 1,
                "drawingAtHT_overall": 2,
                "drawingAtHTPercentage_home": 33,
                "drawingAtHTPercentage_away": 50,
                "drawingAtHTPercentage_overall": 40,
                "trailingAtHT_home": 0,
                "trailingAtHT_away": 0,
                "trailingAtHT_overall": 0,
                "trailingAtHTPercentage_home": 0,
                "trailingAtHTPercentage_away": 0,
                "trailingAtHTPercentage_overall": 0,
                "HTPoints_overall": 11,
                "HTPoints_home": 7,
                "HTPoints_away": 4,
                "HTPPG_overall": 2.2,
                "HTPPG_home": 2.33,
                "HTPPG_away": 2,
                "scoredAVGHT_overall": 1,
                "scoredAVGHT_home": 1.33,
                "scoredAVGHT_away": 0.5,
                "concededAVGHT_overall": 0.2,
                "concededAVGHT_home": 0.33,
                "concededAVGHT_away": 0,
                "AVGHT_overall": 1.2,
                "AVGHT_home": 1.67,
                "AVGHT_away": 0.5,
                "scoredGoalsHT_overall": 5,
                "scoredGoalsHT_home": 4,
                "scoredGoalsHT_away": 1,
                "concededGoalsHT_overall": 1,
                "concededGoalsHT_home": 1,
                "concededGoalsHT_away": 0,
                "GoalsHT_overall": 6,
                "GoalsHT_home": 5,
                "GoalsHT_away": 1,
                "GoalDifferenceHT_overall": 4,
                "GoalDifferenceHT_home": 3,
                "GoalDifferenceHT_away": 1,
                "seasonOver55Num_overall": 0,
                "seasonOver45Num_overall": 0,
                "seasonOver35Num_overall": 0,
                "seasonOver25Num_overall": 2,
                "seasonOver15Num_overall": 3,
                "seasonOver05Num_overall": 4,
                "seasonOver55Percentage_overall": 0,
                "seasonOver45Percentage_overall": 0,
                "seasonOver35Percentage_overall": 0,
                "seasonOver25Percentage_overall": 40,
                "seasonOver15Percentage_overall": 60,
                "seasonOver05Percentage_overall": 80,
                "seasonUnder55Percentage_overall": 100,
                "seasonUnder45Percentage_overall": 100,
                "seasonUnder35Percentage_overall": 100,
                "seasonUnder25Percentage_overall": 60,
                "seasonUnder15Percentage_overall": 40,
                "seasonUnder05Percentage_overall": 20,
                "seasonUnder55Num_overall": 5,
                "seasonUnder45Num_overall": 5,
                "seasonUnder35Num_overall": 5,
                "seasonUnder25Num_overall": 3,
                "seasonUnder15Num_overall": 2,
                "seasonUnder05Num_overall": 1,
                "seasonOver55Percentage_home": 0,
                "seasonOver45Percentage_home": 0,
                "seasonOver35Percentage_home": 0,
                "seasonOver25Percentage_home": 33,
                "seasonOver15Percentage_home": 67,
                "seasonOver05Percentage_home": 100,
                "seasonOver55Num_home": 0,
                "seasonOver45Num_home": 0,
                "seasonOver35Num_home": 0,
                "seasonOver25Num_home": 1,
                "seasonOver15Num_home": 2,
                "seasonOver05Num_home": 3,
                "seasonUnder55Percentage_home": 100,
                "seasonUnder45Percentage_home": 100,
                "seasonUnder35Percentage_home": 100,
                "seasonUnder25Percentage_home": 67,
                "seasonUnder15Percentage_home": 33,
                "seasonUnder05Percentage_home": 0,
                "seasonUnder55Num_home": 3,
                "seasonUnder45Num_home": 3,
                "seasonUnder35Num_home": 3,
                "seasonUnder25Num_home": 2,
                "seasonUnder15Num_home": 1,
                "seasonUnder05Num_home": 0,
                "seasonOver55Percentage_away": 0,
                "seasonOver45Percentage_away": 0,
                "seasonOver35Percentage_away": 0,
                "seasonOver25Percentage_away": 50,
                "seasonOver15Percentage_away": 50,
                "seasonOver05Percentage_away": 50,
                "seasonOver55Num_away": 0,
                "seasonOver45Num_away": 0,
                "seasonOver35Num_away": 0,
                "seasonOver25Num_away": 1,
                "seasonOver15Num_away": 1,
                "seasonOver05Num_away": 1,
                "seasonUnder55Percentage_away": 100,
                "seasonUnder45Percentage_away": 100,
                "seasonUnder35Percentage_away": 100,
                "seasonUnder25Percentage_away": 50,
                "seasonUnder15Percentage_away": 50,
                "seasonUnder05Percentage_away": 50,
                "seasonUnder55Num_away": 2,
                "seasonUnder45Num_away": 2,
                "seasonUnder35Num_away": 2,
                "seasonUnder25Num_away": 1,
                "seasonUnder15Num_away": 1,
                "seasonUnder05Num_away": 1,
                "seasonOver25NumHT_overall": 0,
                "seasonOver15NumHT_overall": 2,
                "seasonOver05NumHT_overall": 4,
                "seasonOver25PercentageHT_overall": 0,
                "seasonOver15PercentageHT_overall": 40,
                "seasonOver05PercentageHT_overall": 80,
                "seasonOver25PercentageHT_home": 0,
                "seasonOver15PercentageHT_home": 67,
                "seasonOver05PercentageHT_home": 100,
                "seasonOver25NumHT_home": 0,
                "seasonOver15NumHT_home": 2,
                "seasonOver05NumHT_home": 3,
                "seasonOver25PercentageHT_away": 0,
                "seasonOver15PercentageHT_away": 0,
                "seasonOver05PercentageHT_away": 50,
                "seasonOver25NumHT_away": 0,
                "seasonOver15NumHT_away": 0,
                "seasonOver05NumHT_away": 1,
                "cornersRecorded_matches_overall": 4,
                "cornersRecorded_matches_home": 3,
                "cornersRecorded_matches_away": 1,
                "over65Corners_overall": 3,
                "over75Corners_overall": 3,
                "over85Corners_overall": 3,
                "over95Corners_overall": 3,
                "over105Corners_overall": 2,
                "over115Corners_overall": 1,
                "over125Corners_overall": 1,
                "over135Corners_overall": 1,
                "over145Corners_overall": 0,
                "over65CornersPercentage_overall": 75,
                "over75CornersPercentage_overall": 75,
                "over85CornersPercentage_overall": 75,
                "over95CornersPercentage_overall": 75,
                "over105CornersPercentage_overall": 50,
                "over115CornersPercentage_overall": 25,
                "over125CornersPercentage_overall": 25,
                "over135CornersPercentage_overall": 25,
                "over145CornersPercentage_overall": 0,
                "over65Corners_home": 2,
                "over75Corners_home": 2,
                "over85Corners_home": 2,
                "over95Corners_home": 2,
                "over105Corners_home": 1,
                "over115Corners_home": 1,
                "over125Corners_home": 1,
                "over135Corners_home": 1,
                "over145Corners_home": 0,
                "over65CornersPercentage_home": 67,
                "over75CornersPercentage_home": 67,
                "over85CornersPercentage_home": 67,
                "over95CornersPercentage_home": 67,
                "over105CornersPercentage_home": 33,
                "over115CornersPercentage_home": 33,
                "over125CornersPercentage_home": 33,
                "over135CornersPercentage_home": 33,
                "over145CornersPercentage_home": 0,
                "over65Corners_away": 1,
                "over75Corners_away": 1,
                "over85Corners_away": 1,
                "over95Corners_away": 1,
                "over105Corners_away": 1,
                "over115Corners_away": 0,
                "over125Corners_away": 0,
                "over135Corners_away": 0,
                "over145Corners_away": 0,
                "over65CornersPercentage_away": 100,
                "over75CornersPercentage_away": 100,
                "over85CornersPercentage_away": 100,
                "over95CornersPercentage_away": 100,
                "over105CornersPercentage_away": 100,
                "over115CornersPercentage_away": 0,
                "over125CornersPercentage_away": 0,
                "over135CornersPercentage_away": 0,
                "over145CornersPercentage_away": 0,
                "over25CornersFor_overall": 4,
                "over35CornersFor_overall": 3,
                "over45CornersFor_overall": 2,
                "over55CornersFor_overall": 2,
                "over65CornersFor_overall": 2,
                "over75CornersFor_overall": 2,
                "over85CornersFor_overall": 2,
                "over25CornersForPercentage_overall": 100,
                "over35CornersForPercentage_overall": 75,
                "over45CornersForPercentage_overall": 50,
                "over55CornersForPercentage_overall": 50,
                "over65CornersForPercentage_overall": 50,
                "over75CornersForPercentage_overall": 50,
                "over85CornersForPercentage_overall": 50,
                "over25CornersFor_home": 3,
                "over35CornersFor_home": 2,
                "over45CornersFor_home": 2,
                "over55CornersFor_home": 2,
                "over65CornersFor_home": 2,
                "over75CornersFor_home": 2,
                "over85CornersFor_home": 2,
                "over25CornersForPercentage_home": 100,
                "over35CornersForPercentage_home": 67,
                "over45CornersForPercentage_home": 67,
                "over55CornersForPercentage_home": 67,
                "over65CornersForPercentage_home": 67,
                "over75CornersForPercentage_home": 67,
                "over85CornersForPercentage_home": 67,
                "over25CornersFor_away": 1,
                "over35CornersFor_away": 1,
                "over45CornersFor_away": 0,
                "over55CornersFor_away": 0,
                "over65CornersFor_away": 0,
                "over75CornersFor_away": 0,
                "over85CornersFor_away": 0,
                "over25CornersForPercentage_away": 100,
                "over35CornersForPercentage_away": 100,
                "over45CornersForPercentage_away": 0,
                "over55CornersForPercentage_away": 0,
                "over65CornersForPercentage_away": 0,
                "over75CornersForPercentage_away": 0,
                "over85CornersForPercentage_away": 0,
                "over25CornersAgainst_overall": 2,
                "over35CornersAgainst_overall": 2,
                "over45CornersAgainst_overall": 1,
                "over55CornersAgainst_overall": 1,
                "over65CornersAgainst_overall": 1,
                "over75CornersAgainst_overall": 0,
                "over85CornersAgainst_overall": 0,
                "over25CornersAgainstPercentage_overall": 50,
                "over35CornersAgainstPercentage_overall": 50,
                "over45CornersAgainstPercentage_overall": 25,
                "over55CornersAgainstPercentage_overall": 25,
                "over65CornersAgainstPercentage_overall": 25,
                "over75CornersAgainstPercentage_overall": 0,
                "over85CornersAgainstPercentage_overall": 0,
                "over25CornersAgainst_home": 1,
                "over35CornersAgainst_home": 1,
                "over45CornersAgainst_home": 0,
                "over55CornersAgainst_home": 0,
                "over65CornersAgainst_home": 0,
                "over75CornersAgainst_home": 0,
                "over85CornersAgainst_home": 0,
                "over25CornersAgainstPercentage_home": 33,
                "over35CornersAgainstPercentage_home": 33,
                "over45CornersAgainstPercentage_home": 0,
                "over55CornersAgainstPercentage_home": 0,
                "over65CornersAgainstPercentage_home": 0,
                "over75CornersAgainstPercentage_home": 0,
                "over85CornersAgainstPercentage_home": 0,
                "over25CornersAgainst_away": 1,
                "over35CornersAgainst_away": 1,
                "over45CornersAgainst_away": 1,
                "over55CornersAgainst_away": 1,
                "over65CornersAgainst_away": 1,
                "over75CornersAgainst_away": 0,
                "over85CornersAgainst_away": 0,
                "over25CornersAgainstPercentage_away": 100,
                "over35CornersAgainstPercentage_away": 100,
                "over45CornersAgainstPercentage_away": 100,
                "over55CornersAgainstPercentage_away": 100,
                "over65CornersAgainstPercentage_away": 100,
                "over75CornersAgainstPercentage_away": 0,
                "over85CornersAgainstPercentage_away": 0,
                "over05Cards_overall": 5,
                "over15Cards_overall": 5,
                "over25Cards_overall": 3,
                "over35Cards_overall": 1,
                "over45Cards_overall": 1,
                "over55Cards_overall": 1,
                "over65Cards_overall": 0,
                "over75Cards_overall": 0,
                "over85Cards_overall": 0,
                "over05CardsPercentage_overall": 100,
                "over15CardsPercentage_overall": 100,
                "over25CardsPercentage_overall": 60,
                "over35CardsPercentage_overall": 20,
                "over45CardsPercentage_overall": 20,
                "over55CardsPercentage_overall": 20,
                "over65CardsPercentage_overall": 0,
                "over75CardsPercentage_overall": 0,
                "over85CardsPercentage_overall": 0,
                "over05Cards_home": 3,
                "over15Cards_home": 3,
                "over25Cards_home": 2,
                "over35Cards_home": 1,
                "over45Cards_home": 1,
                "over55Cards_home": 1,
                "over65Cards_home": 0,
                "over75Cards_home": 0,
                "over85Cards_home": 0,
                "over05CardsPercentage_home": 100,
                "over15CardsPercentage_home": 100,
                "over25CardsPercentage_home": 67,
                "over35CardsPercentage_home": 33,
                "over45CardsPercentage_home": 33,
                "over55CardsPercentage_home": 33,
                "over65CardsPercentage_home": 0,
                "over75CardsPercentage_home": 0,
                "over85CardsPercentage_home": 0,
                "over05Cards_away": 2,
                "over15Cards_away": 2,
                "over25Cards_away": 1,
                "over35Cards_away": 0,
                "over45Cards_away": 0,
                "over55Cards_away": 0,
                "over65Cards_away": 0,
                "over75Cards_away": 0,
                "over85Cards_away": 0,
                "over05CardsPercentage_away": 100,
                "over15CardsPercentage_away": 100,
                "over25CardsPercentage_away": 50,
                "over35CardsPercentage_away": 0,
                "over45CardsPercentage_away": 0,
                "over55CardsPercentage_away": 0,
                "over65CardsPercentage_away": 0,
                "over75CardsPercentage_away": 0,
                "over85CardsPercentage_away": 0,
                "over05CardsFor_overall": 5,
                "over15CardsFor_overall": 4,
                "over25CardsFor_overall": 0,
                "over35CardsFor_overall": 0,
                "over45CardsFor_overall": 0,
                "over55CardsFor_overall": 0,
                "over65CardsFor_overall": 0,
                "over05CardsForPercentage_overall": 100,
                "over15CardsForPercentage_overall": 80,
                "over25CardsForPercentage_overall": 0,
                "over35CardsForPercentage_overall": 0,
                "over45CardsForPercentage_overall": 0,
                "over55CardsForPercentage_overall": 0,
                "over65CardsForPercentage_overall": 0,
                "over05CardsFor_home": 3,
                "over15CardsFor_home": 2,
                "over25CardsFor_home": 0,
                "over35CardsFor_home": 0,
                "over45CardsFor_home": 0,
                "over55CardsFor_home": 0,
                "over65CardsFor_home": 0,
                "over05CardsForPercentage_home": 100,
                "over15CardsForPercentage_home": 67,
                "over25CardsForPercentage_home": 0,
                "over35CardsForPercentage_home": 0,
                "over45CardsForPercentage_home": 0,
                "over55CardsForPercentage_home": 0,
                "over65CardsForPercentage_home": 0,
                "over05CardsFor_away": 2,
                "over15CardsFor_away": 2,
                "over25CardsFor_away": 0,
                "over35CardsFor_away": 0,
                "over45CardsFor_away": 0,
                "over55CardsFor_away": 0,
                "over65CardsFor_away": 0,
                "over05CardsForPercentage_away": 100,
                "over15CardsForPercentage_away": 100,
                "over25CardsForPercentage_away": 0,
                "over35CardsForPercentage_away": 0,
                "over45CardsForPercentage_away": 0,
                "over55CardsForPercentage_away": 0,
                "over65CardsForPercentage_away": 0,
                "over05CardsAgainst_overall": 4,
                "over15CardsAgainst_overall": 1,
                "over25CardsAgainst_overall": 1,
                "over35CardsAgainst_overall": 1,
                "over45CardsAgainst_overall": 0,
                "over55CardsAgainst_overall": 0,
                "over65CardsAgainst_overall": 0,
                "over05CardsAgainstPercentage_overall": 80,
                "over15CardsAgainstPercentage_overall": 20,
                "over25CardsAgainstPercentage_overall": 20,
                "over35CardsAgainstPercentage_overall": 20,
                "over45CardsAgainstPercentage_overall": 0,
                "over55CardsAgainstPercentage_overall": 0,
                "over65CardsAgainstPercentage_overall": 0,
                "over05CardsAgainst_home": 3,
                "over15CardsAgainst_home": 1,
                "over25CardsAgainst_home": 1,
                "over35CardsAgainst_home": 1,
                "over45CardsAgainst_home": 0,
                "over55CardsAgainst_home": 0,
                "over65CardsAgainst_home": 0,
                "over05CardsAgainstPercentage_home": 100,
                "over15CardsAgainstPercentage_home": 33,
                "over25CardsAgainstPercentage_home": 33,
                "over35CardsAgainstPercentage_home": 33,
                "over45CardsAgainstPercentage_home": 0,
                "over55CardsAgainstPercentage_home": 0,
                "over65CardsAgainstPercentage_home": 0,
                "over05CardsAgainst_away": 1,
                "over15CardsAgainst_away": 0,
                "over25CardsAgainst_away": 0,
                "over35CardsAgainst_away": 0,
                "over45CardsAgainst_away": 0,
                "over55CardsAgainst_away": 0,
                "over65CardsAgainst_away": 0,
                "over05CardsAgainstPercentage_away": 50,
                "over15CardsAgainstPercentage_away": 0,
                "over25CardsAgainstPercentage_away": 0,
                "over35CardsAgainstPercentage_away": 0,
                "over45CardsAgainstPercentage_away": 0,
                "over55CardsAgainstPercentage_away": 0,
                "over65CardsAgainstPercentage_away": 0,
                "leaguePosition_overall": 0,
                "leaguePosition_home": 0,
                "leaguePosition_away": 0,
                "firstGoalScored_home": 3,
                "firstGoalScored_away": 1,
                "firstGoalScored_overall": 4,
                "firstGoalScoredPercentage_home": 100,
                "firstGoalScoredPercentage_away": 50,
                "firstGoalScoredPercentage_overall": 80,
                "cornersTotal_overall": 26,
                "cornersTotal_home": 22,
                "cornersTotal_away": 4,
                "cardsTotal_overall": 9,
                "cardsTotal_home": 5,
                "cardsTotal_away": 4,
                "cornersTotalAVG_overall": 9.75,
                "cornersTotalAVG_home": 9.33,
                "cornersTotalAVG_away": 11,
                "cornersAVG_overall": 6.5,
                "cornersAVG_home": 7.33,
                "cornersAVG_away": 4,
                "cornersAgainst_overall": 13,
                "cornersAgainst_home": 6,
                "cornersAgainst_away": 7,
                "cornersAgainstAVG_overall": 3.25,
                "cornersAgainstAVG_home": 2,
                "cornersAgainstAVG_away": 7,
                "cornersHighest_overall": 10,
                "cornersLowest_overall": 3,
                "cardsHighest_overall": 2,
                "cardsLowest_overall": 1,
                "cardsAVG_overall": 1.8,
                "cardsAVG_home": 1.67,
                "cardsAVG_away": 2,
                "shotsTotal_overall": 37,
                "shotsTotal_home": 31,
                "shotsTotal_away": 6,
                "shotsAVG_overall": 9.25,
                "shotsAVG_home": 10.33,
                "shotsAVG_away": 6,
                "shotsOnTargetTotal_overall": 20,
                "shotsOnTargetTotal_home": 17,
                "shotsOnTargetTotal_away": 3,
                "shotsOffTargetTotal_overall": 17,
                "shotsOffTargetTotal_home": 14,
                "shotsOffTargetTotal_away": 3,
                "shotsOnTargetAVG_overall": 5,
                "shotsOnTargetAVG_home": 5.67,
                "shotsOnTargetAVG_away": 3,
                "shotsOffTargetAVG_overall": 4.25,
                "shotsOffTargetAVG_home": 4.67,
                "shotsOffTargetAVG_away": 3,
                "possessionAVG_overall": 54,
                "possessionAVG_home": 63,
                "possessionAVG_away": 28,
                "foulsAVG_overall": 14.75,
                "foulsAVG_home": 13,
                "foulsAVG_away": 20,
                "foulsTotal_overall": 59,
                "foulsTotal_home": 39,
                "foulsTotal_away": 20,
                "offsidesTotal_overall": 14,
                "offsidesTotal_home": 11,
                "offsidesTotal_away": 3,
                "offsidesTeamTotal_overall": 6,
                "offsidesTeamTotal_home": 5,
                "offsidesTeamTotal_away": 1,
                "offsidesRecorded_matches_overall": 4,
                "offsidesRecorded_matches_home": 3,
                "offsidesRecorded_matches_away": 1,
                "offsidesAVG_overall": 3.5,
                "offsidesAVG_home": 3.67,
                "offsidesAVG_away": 3,
                "offsidesTeamAVG_overall": 1.5,
                "offsidesTeamAVG_home": 1.67,
                "offsidesTeamAVG_away": 1,
                "offsidesOver05_overall": 4,
                "offsidesOver15_overall": 4,
                "offsidesOver25_overall": 3,
                "offsidesOver35_overall": 1,
                "offsidesOver45_overall": 1,
                "offsidesOver55_overall": 1,
                "offsidesOver65_overall": 0,
                "over05OffsidesPercentage_overall": 100,
                "over15OffsidesPercentage_overall": 100,
                "over25OffsidesPercentage_overall": 75,
                "over35OffsidesPercentage_overall": 25,
                "over45OffsidesPercentage_overall": 25,
                "over55OffsidesPercentage_overall": 25,
                "over65OffsidesPercentage_overall": 0,
                "offsidesOver05_home": 3,
                "offsidesOver15_home": 3,
                "offsidesOver25_home": 2,
                "offsidesOver35_home": 1,
                "offsidesOver45_home": 1,
                "offsidesOver55_home": 1,
                "offsidesOver65_home": 0,
                "over05OffsidesPercentage_home": 100,
                "over15OffsidesPercentage_home": 100,
                "over25OffsidesPercentage_home": 67,
                "over35OffsidesPercentage_home": 33,
                "over45OffsidesPercentage_home": 33,
                "over55OffsidesPercentage_home": 33,
                "over65OffsidesPercentage_home": 0,
                "offsidesOver05_away": 1,
                "offsidesOver15_away": 1,
                "offsidesOver25_away": 1,
                "offsidesOver35_away": 0,
                "offsidesOver45_away": 0,
                "offsidesOver55_away": 0,
                "offsidesOver65_away": 0,
                "over05OffsidesPercentage_away": 100,
                "over15OffsidesPercentage_away": 100,
                "over25OffsidesPercentage_away": 100,
                "over35OffsidesPercentage_away": 0,
                "over45OffsidesPercentage_away": 0,
                "over55OffsidesPercentage_away": 0,
                "over65OffsidesPercentage_away": 0,
                "offsidesTeamOver05_overall": 4,
                "offsidesTeamOver15_overall": 1,
                "offsidesTeamOver25_overall": 1,
                "offsidesTeamOver35_overall": 0,
                "offsidesTeamOver45_overall": 0,
                "offsidesTeamOver55_overall": 0,
                "offsidesTeamOver65_overall": 0,
                "over05OffsidesTeamPercentage_overall": 100,
                "over15OffsidesTeamPercentage_overall": 25,
                "over25OffsidesTeamPercentage_overall": 25,
                "over35OffsidesTeamPercentage_overall": 0,
                "over45OffsidesTeamPercentage_overall": 0,
                "over55OffsidesTeamPercentage_overall": 0,
                "over65OffsidesTeamPercentage_overall": 0,
                "offsidesTeamOver05_home": 3,
                "offsidesTeamOver15_home": 1,
                "offsidesTeamOver25_home": 1,
                "offsidesTeamOver35_home": 0,
                "offsidesTeamOver45_home": 0,
                "offsidesTeamOver55_home": 0,
                "offsidesTeamOver65_home": 0,
                "over05OffsidesTeamPercentage_home": 100,
                "over15OffsidesTeamPercentage_home": 33,
                "over25OffsidesTeamPercentage_home": 33,
                "over35OffsidesTeamPercentage_home": 0,
                "over45OffsidesTeamPercentage_home": 0,
                "over55OffsidesTeamPercentage_home": 0,
                "over65OffsidesTeamPercentage_home": 0,
                "offsidesTeamOver05_away": 1,
                "offsidesTeamOver15_away": 0,
                "offsidesTeamOver25_away": 0,
                "offsidesTeamOver35_away": 0,
                "offsidesTeamOver45_away": 0,
                "offsidesTeamOver55_away": 0,
                "offsidesTeamOver65_away": 0,
                "over05OffsidesTeamPercentage_away": 100,
                "over15OffsidesTeamPercentage_away": 0,
                "over25OffsidesTeamPercentage_away": 0,
                "over35OffsidesTeamPercentage_away": 0,
                "over45OffsidesTeamPercentage_away": 0,
                "over55OffsidesTeamPercentage_away": 0,
                "over65OffsidesTeamPercentage_away": 0,
                "scoredBothHalves_overall": 2,
                "scoredBothHalves_home": 1,
                "scoredBothHalves_away": 1,
                "scoredBothHalvesPercentage_overall": 40,
                "scoredBothHalvesPercentage_home": 33,
                "scoredBothHalvesPercentage_away": 50,
                "seasonMatchesPlayedGoalTimingRecorded_overall": 5,
                "seasonMatchesPlayedGoalTimingRecorded_home": 3,
                "seasonMatchesPlayedGoalTimingRecorded_away": 2,
                "BTTS_and_win_overall": 1,
                "BTTS_and_win_home": 1,
                "BTTS_and_win_away": 0,
                "BTTS_and_win_percentage_overall": 20,
                "BTTS_and_win_percentage_home": 33,
                "BTTS_and_win_percentage_away": 0,
                "BTTS_and_draw_overall": 0,
                "BTTS_and_draw_home": 0,
                "BTTS_and_draw_away": 0,
                "BTTS_and_draw_percentage_overall": 0,
                "BTTS_and_draw_percentage_home": 0,
                "BTTS_and_draw_percentage_away": 0,
                "BTTS_and_lose_overall": 0,
                "BTTS_and_lose_home": 0,
                "BTTS_and_lose_away": 0,
                "BTTS_and_lose_percentage_overall": 0,
                "BTTS_and_lose_percentage_home": 0,
                "BTTS_and_lose_percentage_away": 0,
                "AVG_2hg_overall": 0.6,
                "AVG_2hg_home": 0.33,
                "AVG_2hg_away": 1,
                "scored_2hg_avg_overall": 0.6,
                "scored_2hg_avg_home": 0.33,
                "scored_2hg_avg_away": 1,
                "conceded_2hg_avg_overall": 0,
                "conceded_2hg_avg_home": 0,
                "conceded_2hg_avg_away": 0,
                "total_2hg_overall": 3,
                "total_2hg_home": 1,
                "total_2hg_away": 2,
                "conceded_2hg_overall": 0,
                "conceded_2hg_home": 0,
                "conceded_2hg_away": 0,
                "scored_2hg_overall": 3,
                "scored_2hg_home": 1,
                "scored_2hg_away": 2,
                "over25_2hg_num_overall": 0,
                "over15_2hg_num_overall": 1,
                "over05_2hg_num_overall": 2,
                "over25_2hg_percentage_overall": 0,
                "over15_2hg_percentage_overall": 20,
                "over05_2hg_percentage_overall": 40,
                "over25_2hg_num_home": 0,
                "over15_2hg_num_home": 0,
                "over05_2hg_num_home": 1,
                "over25_2hg_percentage_home": 0,
                "over15_2hg_percentage_home": 0,
                "over05_2hg_percentage_home": 33,
                "over25_2hg_num_away": 0,
                "over15_2hg_num_away": 1,
                "over05_2hg_num_away": 1,
                "over25_2hg_percentage_away": 0,
                "over15_2hg_percentage_away": 50,
                "over05_2hg_percentage_away": 50,
                "points_2hg_overall": 9,
                "points_2hg_home": 5,
                "points_2hg_away": 4,
                "ppg_2hg_overall": 1.8,
                "ppg_2hg_home": 1.67,
                "ppg_2hg_away": 2,
                "wins_2hg_overall": 2,
                "wins_2hg_home": 1,
                "wins_2hg_away": 1,
                "wins_2hg_percentage_overall": 40,
                "wins_2hg_percentage_home": 33,
                "wins_2hg_percentage_away": 50,
                "draws_2hg_overall": 3,
                "draws_2hg_home": 2,
                "draws_2hg_away": 1,
                "draws_2hg_percentage_overall": 60,
                "draws_2hg_percentage_home": 67,
                "draws_2hg_percentage_away": 50,
                "losses_2hg_overall": 0,
                "losses_2hg_home": 0,
                "losses_2hg_away": 0,
                "losses_2hg_percentage_overall": 0,
                "losses_2hg_percentage_home": 0,
                "losses_2hg_percentage_away": 0,
                "gd_2hg_overall": 3,
                "gd_2hg_home": 1,
                "gd_2hg_away": 2,
                "btts_2hg_overall": 0,
                "btts_2hg_home": 0,
                "btts_2hg_away": 0,
                "btts_2hg_percentage_overall": 0,
                "btts_2hg_percentage_home": 0,
                "btts_2hg_percentage_away": 0,
                "btts_fhg_overall": 1,
                "btts_fhg_home": 1,
                "btts_fhg_away": 0,
                "btts_fhg_percentage_overall": 20,
                "btts_fhg_percentage_home": 33,
                "btts_fhg_percentage_away": 0,
                "cs_2hg_overall": 5,
                "cs_2hg_home": 3,
                "cs_2hg_away": 2,
                "cs_2hg_percentage_overall": 100,
                "cs_2hg_percentage_home": 100,
                "cs_2hg_percentage_away": 100,
                "fts_2hg_overall": 3,
                "fts_2hg_home": 2,
                "fts_2hg_away": 1,
                "fts_2hg_percentage_overall": 60,
                "fts_2hg_percentage_home": 67,
                "fts_2hg_percentage_away": 50,
                "BTTS_both_halves_overall": 0,
                "BTTS_both_halves_home": 0,
                "BTTS_both_halves_away": 0,
                "BTTS_both_halves_percentage_overall": 0,
                "BTTS_both_halves_percentage_home": 0,
                "BTTS_both_halves_percentage_away": 0,
                "average_attendance_overall": 0,
                "average_attendance_home": 0,
                "average_attendance_away": 0,
                "cornerTimingRecorded_matches_overall": 4,
                "cornerTimingRecorded_matches_home": 3,
                "cornerTimingRecorded_matches_away": 1,
                "corners_fh_overall": 12,
                "corners_2h_overall": 27,
                "corners_fh_home": 8,
                "corners_2h_home": 20,
                "corners_fh_away": 4,
                "corners_2h_away": 7,
                "corners_fh_avg_overall": 3,
                "corners_2h_avg_overall": 6.75,
                "corners_fh_avg_home": 2.67,
                "corners_2h_avg_home": 6.67,
                "corners_fh_avg_away": 4,
                "corners_2h_avg_away": 7,
                "corners_fh_over4_overall": 0,
                "corners_2h_over4_overall": 3,
                "corners_fh_over4_home": 0,
                "corners_2h_over4_home": 2,
                "corners_fh_over4_away": 0,
                "corners_2h_over4_away": 1,
                "corners_fh_over4_percentage_overall": 0,
                "corners_2h_over4_percentage_overall": 75,
                "corners_fh_over4_percentage_home": 0,
                "corners_2h_over4_percentage_home": 67,
                "corners_fh_over4_percentage_away": 0,
                "corners_2h_over4_percentage_away": 100,
                "corners_fh_over5_overall": 0,
                "corners_2h_over5_overall": 3,
                "corners_fh_over5_home": 0,
                "corners_2h_over5_home": 2,
                "corners_fh_over5_away": 0,
                "corners_2h_over5_away": 1,
                "corners_fh_over5_percentage_overall": 0,
                "corners_2h_over5_percentage_overall": 75,
                "corners_fh_over5_percentage_home": 0,
                "corners_2h_over5_percentage_home": 67,
                "corners_fh_over5_percentage_away": 0,
                "corners_2h_over5_percentage_away": 100,
                "corners_fh_over6_overall": 0,
                "corners_2h_over6_overall": 3,
                "corners_fh_over6_home": 0,
                "corners_2h_over6_home": 2,
                "corners_fh_over6_away": 0,
                "corners_2h_over6_away": 1,
                "corners_fh_over6_percentage_overall": 0,
                "corners_2h_over6_percentage_overall": 75,
                "corners_fh_over6_percentage_home": 0,
                "corners_2h_over6_percentage_home": 67,
                "corners_fh_over6_percentage_away": 0,
                "corners_2h_over6_percentage_away": 100,
                "attack_num_recoded_matches_overall": 4,
                "dangerous_attacks_num_overall": 242,
                "attacks_num_overall": 415,
                "dangerous_attacks_avg_overall": 60.5,
                "dangerous_attacks_avg_home": 75,
                "dangerous_attacks_avg_away": 17,
                "attacks_avg_overall": 103.75,
                "attacks_avg_home": 112.67,
                "attacks_avg_away": 77,
                "xg_for_avg_overall": 1.42,
                "xg_for_avg_home": 1.65,
                "xg_for_avg_away": 0.74,
                "xg_against_avg_overall": 1.09,
                "xg_against_avg_home": 0.94,
                "xg_against_avg_away": 1.52,
                "additional_info": {
                    "attack_num_recoded_matches_home": 3,
                    "attack_num_recoded_matches_away": 1,
                    "dangerous_attacks_num_home": 225,
                    "dangerous_attacks_num_away": 17,
                    "attacks_num_home": 338,
                    "attacks_num_away": 77,
                    "xg_for_overall": 5.51,
                    "xg_for_home": 4.79,
                    "xg_for_away": 0.72,
                    "xg_against_overall": 4.35,
                    "xg_against_home": 2.83,
                    "xg_against_away": 1.52,
                    "seasonScoredOver35Num_overall": 0,
                    "seasonScoredOver25Num_overall": 1,
                    "seasonScoredOver15Num_overall": 3,
                    "seasonScoredOver05Num_overall": 4,
                    "seasonScoredOver35Percentage_overall": 0,
                    "seasonScoredOver25Percentage_overall": 20,
                    "seasonScoredOver15Percentage_overall": 60,
                    "seasonScoredOver05Percentage_overall": 80,
                    "seasonScoredOver35Num_home": 0,
                    "seasonScoredOver25Num_home": 0,
                    "seasonScoredOver15Num_home": 2,
                    "seasonScoredOver05Num_home": 3,
                    "seasonScoredOver35Percentage_home": 0,
                    "seasonScoredOver25Percentage_home": 0,
                    "seasonScoredOver15Percentage_home": 67,
                    "seasonScoredOver05Percentage_home": 100,
                    "seasonScoredOver35Num_away": 0,
                    "seasonScoredOver25Num_away": 1,
                    "seasonScoredOver15Num_away": 1,
                    "seasonScoredOver05Num_away": 1,
                    "seasonScoredOver35Percentage_away": 0,
                    "seasonScoredOver25Percentage_away": 50,
                    "seasonScoredOver15Percentage_away": 50,
                    "seasonScoredOver05Percentage_away": 50,
                    "seasonConcededOver35Num_overall": 0,
                    "seasonConcededOver25Num_overall": 0,
                    "seasonConcededOver15Num_overall": 0,
                    "seasonConcededOver05Num_overall": 1,
                    "seasonConcededOver35Percentage_overall": 0,
                    "seasonConcededOver25Percentage_overall": 0,
                    "seasonConcededOver15Percentage_overall": 0,
                    "seasonConcededOver05Percentage_overall": 20,
                    "seasonConcededOver35Num_home": 0,
                    "seasonConcededOver25Num_home": 0,
                    "seasonConcededOver15Num_home": 0,
                    "seasonConcededOver05Num_home": 1,
                    "seasonConcededOver35Percentage_home": 0,
                    "seasonConcededOver25Percentage_home": 0,
                    "seasonConcededOver15Percentage_home": 0,
                    "seasonConcededOver05Percentage_home": 33,
                    "formRun_overall": "wwdww",
                    "formRun_home": "www",
                    "formRun_away": "dw",
                    "seasonConcededOver35Num_away": 0,
                    "seasonConcededOver25Num_away": 0,
                    "seasonConcededOver15Num_away": 0,
                    "seasonConcededOver05Num_away": 0,
                    "seasonConcededOver35Percentage_away": 0,
                    "seasonConcededOver25Percentage_away": 0,
                    "seasonConcededOver15Percentage_away": 0,
                    "seasonConcededOver05Percentage_away": 0,
                    "cardTimingRecorded_matches_overall": 5,
                    "cardTimingRecorded_matches_home": 3,
                    "cardTimingRecorded_matches_away": 2,
                    "cardsRecorded_matches_overall": 5,
                    "cardsRecorded_matches_home": 3,
                    "cardsRecorded_matches_away": 2,
                    "fh_cards_total_overall": 5,
                    "fh_cards_total_home": 5,
                    "fh_cards_total_away": 0,
                    "2h_cards_total_overall": 11,
                    "2h_cards_total_home": 6,
                    "2h_cards_total_away": 5,
                    "fh_cards_for_overall": 3,
                    "fh_cards_for_home": 3,
                    "fh_cards_for_away": 0,
                    "2h_cards_for_overall": 6,
                    "2h_cards_for_home": 2,
                    "2h_cards_for_away": 4,
                    "fh_cards_against_overall": 2,
                    "fh_cards_against_home": 2,
                    "fh_cards_against_away": 0,
                    "2h_cards_against_overall": 5,
                    "2h_cards_against_home": 4,
                    "2h_cards_against_away": 1,
                    "fh_cards_for_avg_overall": 0.6,
                    "fh_cards_for_avg_home": 1,
                    "fh_cards_for_avg_away": 0,
                    "2h_cards_for_avg_overall": 1.2,
                    "2h_cards_for_avg_home": 0.67,
                    "2h_cards_for_avg_away": 2,
                    "fh_cards_against_avg_overall": 0.4,
                    "fh_cards_against_avg_home": 0.67,
                    "fh_cards_against_avg_away": 0,
                    "2h_cards_against_avg_overall": 1,
                    "2h_cards_against_avg_home": 1.33,
                    "2h_cards_against_avg_away": 0.5,
                    "fh_cards_total_avg_overall": 1,
                    "fh_cards_total_avg_home": 1.67,
                    "fh_cards_total_avg_away": 0,
                    "2h_cards_total_avg_overall": 2.2,
                    "2h_cards_total_avg_home": 2,
                    "2h_cards_total_avg_away": 2.5,
                    "fh_total_cards_under2_percentage_overall": 80,
                    "fh_total_cards_under2_percentage_home": 67,
                    "fh_total_cards_under2_percentage_away": 100,
                    "fh_total_cards_2to3_percentage_overall": 0,
                    "fh_total_cards_2to3_percentage_home": 0,
                    "fh_total_cards_2to3_percentage_away": 0,
                    "fh_total_cards_over3_percentage_overall": 20,
                    "fh_total_cards_over3_percentage_home": 33,
                    "fh_total_cards_over3_percentage_away": 0,
                    "2h_total_cards_under2_percentage_overall": 0,
                    "2h_total_cards_under2_percentage_home": 0,
                    "2h_total_cards_under2_percentage_away": 0,
                    "2h_total_cards_2to3_percentage_overall": 100,
                    "2h_total_cards_2to3_percentage_home": 100,
                    "2h_total_cards_2to3_percentage_away": 100,
                    "2h_total_cards_over3_percentage_overall": 0,
                    "2h_total_cards_over3_percentage_home": 0,
                    "2h_total_cards_over3_percentage_away": 0,
                    "fh_half_with_most_cards_total_percentage_overall": 20,
                    "fh_half_with_most_cards_total_percentage_home": 33,
                    "fh_half_with_most_cards_total_percentage_away": 0,
                    "2h_half_with_most_cards_total_percentage_overall": 80,
                    "2h_half_with_most_cards_total_percentage_home": 67,
                    "2h_half_with_most_cards_total_percentage_away": 100,
                    "fh_cards_for_over05_percentage_overall": 40,
                    "fh_cards_for_over05_percentage_home": 67,
                    "fh_cards_for_over05_percentage_away": 0,
                    "2h_cards_for_over05_percentage_overall": 80,
                    "2h_cards_for_over05_percentage_home": 67,
                    "2h_cards_for_over05_percentage_away": 100,
                    "cards_for_overall": 9,
                    "cards_for_home": 5,
                    "cards_for_away": 4,
                    "cards_against_overall": 7,
                    "cards_against_home": 6,
                    "cards_against_away": 1,
                    "cards_for_avg_overall": 1.8,
                    "cards_for_avg_home": 1.67,
                    "cards_for_avg_away": 2,
                    "cards_against_avg_overall": 1.4,
                    "cards_against_avg_home": 2,
                    "cards_against_avg_away": 0.5,
                    "cards_total_overall": 16,
                    "cards_total_home": 11,
                    "cards_total_away": 5,
                    "cards_total_avg_overall": 3.2,
                    "cards_total_avg_home": 3.67,
                    "cards_total_avg_away": 2.5,
                    "penalties_won_overall": 1,
                    "penalties_won_home": 0,
                    "penalties_won_away": 1,
                    "penalties_scored_overall": 1,
                    "penalties_scored_home": 0,
                    "penalties_scored_away": 1,
                    "penalties_missed_overall": 1,
                    "penalties_missed_home": 0,
                    "penalties_missed_away": 1,
                    "penalties_won_per_match_overall": 0.2,
                    "penalties_won_per_match_home": 0,
                    "penalties_won_per_match_away": 0.5,
                    "penalties_recorded_matches_overall": 5,
                    "penalties_recorded_matches_home": 3,
                    "penalties_recorded_matches_away": 2,
                    "exact_team_goals_0_ft_overall": 1,
                    "exact_team_goals_1_ft_overall": 1,
                    "exact_team_goals_2_ft_overall": 2,
                    "exact_team_goals_3_ft_overall": 1,
                    "exact_team_goals_1_ft_home": 1,
                    "exact_team_goals_2_ft_home": 2,
                    "exact_team_goals_3_ft_home": 0,
                    "exact_team_goals_0_ft_away": 1,
                    "exact_team_goals_1_ft_away": 0,
                    "exact_team_goals_2_ft_away": 0,
                    "exact_team_goals_3_ft_away": 1,
                    "match_shots_over225_num_overall": 0,
                    "match_shots_over235_num_overall": 0,
                    "match_shots_over245_num_overall": 0,
                    "match_shots_over255_num_overall": 0,
                    "match_shots_over265_num_overall": 0,
                    "match_shots_over225_num_home": 0,
                    "match_shots_over235_num_home": 0,
                    "match_shots_over245_num_home": 0,
                    "match_shots_over255_num_home": 0,
                    "match_shots_over265_num_home": 0,
                    "match_shots_over225_num_away": 0,
                    "match_shots_over235_num_away": 0,
                    "match_shots_over245_num_away": 0,
                    "match_shots_over255_num_away": 0,
                    "match_shots_over265_num_away": 0,
                    "match_shots_over225_percentage_overall": 0,
                    "match_shots_over235_percentage_overall": 0,
                    "match_shots_over245_percentage_overall": 0,
                    "match_shots_over255_percentage_overall": 0,
                    "match_shots_over265_percentage_overall": 0,
                    "match_shots_over225_percentage_home": 0,
                    "match_shots_over235_percentage_home": 0,
                    "match_shots_over245_percentage_home": 0,
                    "match_shots_over255_percentage_home": 0,
                    "match_shots_over265_percentage_home": 0,
                    "match_shots_over225_percentage_away": 0,
                    "match_shots_over235_percentage_away": 0,
                    "match_shots_over245_percentage_away": 0,
                    "match_shots_over255_percentage_away": 0,
                    "match_shots_over265_percentage_away": 0,
                    "match_shots_on_target_over75_num_overall": 2,
                    "match_shots_on_target_over85_num_overall": 2,
                    "match_shots_on_target_over95_num_overall": 1,
                    "match_shots_on_target_over75_num_home": 2,
                    "match_shots_on_target_over85_num_home": 2,
                    "match_shots_on_target_over95_num_home": 1,
                    "match_shots_on_target_over75_num_away": 0,
                    "match_shots_on_target_over85_num_away": 0,
                    "match_shots_on_target_over95_num_away": 0,
                    "match_shots_on_target_over75_percentage_overall": 50,
                    "match_shots_on_target_over85_percentage_overall": 50,
                    "match_shots_on_target_over95_percentage_overall": 25,
                    "match_shots_on_target_over75_percentage_home": 67,
                    "match_shots_on_target_over85_percentage_home": 67,
                    "match_shots_on_target_over95_percentage_home": 33,
                    "match_shots_on_target_over75_percentage_away": 0,
                    "match_shots_on_target_over85_percentage_away": 0,
                    "match_shots_on_target_over95_percentage_away": 0,
                    "team_shots_over105_num_overall": 2,
                    "team_shots_over115_num_overall": 2,
                    "team_shots_over125_num_overall": 1,
                    "team_shots_over135_num_overall": 0,
                    "team_shots_over145_num_overall": 0,
                    "team_shots_over155_num_overall": 0,
                    "team_shots_over105_num_home": 2,
                    "team_shots_over115_num_home": 2,
                    "team_shots_over125_num_home": 1,
                    "team_shots_over135_num_home": 0,
                    "team_shots_over145_num_home": 0,
                    "team_shots_over155_num_home": 0,
                    "team_shots_over105_num_away": 0,
                    "team_shots_over115_num_away": 0,
                    "team_shots_over125_num_away": 0,
                    "team_shots_over135_num_away": 0,
                    "team_shots_over145_num_away": 0,
                    "team_shots_over155_num_away": 0,
                    "team_shots_over105_percentage_overall": 50,
                    "team_shots_over115_percentage_overall": 50,
                    "team_shots_over125_percentage_overall": 25,
                    "team_shots_over135_percentage_overall": 0,
                    "team_shots_over145_percentage_overall": 0,
                    "team_shots_over155_percentage_overall": 0,
                    "team_shots_over105_percentage_home": 67,
                    "team_shots_over115_percentage_home": 67,
                    "team_shots_over125_percentage_home": 33,
                    "team_shots_over135_percentage_home": 0,
                    "team_shots_over145_percentage_home": 0,
                    "team_shots_over155_percentage_home": 0,
                    "team_shots_over105_percentage_away": 0,
                    "team_shots_over115_percentage_away": 0,
                    "team_shots_over125_percentage_away": 0,
                    "team_shots_over135_percentage_away": 0,
                    "team_shots_over145_percentage_away": 0,
                    "team_shots_over155_percentage_away": 0,
                    "team_shots_on_target_over35_num_overall": 3,
                    "team_shots_on_target_over45_num_overall": 3,
                    "team_shots_on_target_over55_num_overall": 1,
                    "team_shots_on_target_over65_num_overall": 1,
                    "team_shots_on_target_over35_num_home": 3,
                    "team_shots_on_target_over45_num_home": 3,
                    "team_shots_on_target_over55_num_home": 1,
                    "team_shots_on_target_over65_num_home": 1,
                    "team_shots_on_target_over35_num_away": 0,
                    "team_shots_on_target_over45_num_away": 0,
                    "team_shots_on_target_over55_num_away": 0,
                    "team_shots_on_target_over65_num_away": 0,
                    "team_shots_on_target_over35_percentage_overall": 75,
                    "team_shots_on_target_over45_percentage_overall": 75,
                    "team_shots_on_target_over55_percentage_overall": 25,
                    "team_shots_on_target_over65_percentage_overall": 25,
                    "team_shots_on_target_over35_percentage_home": 100,
                    "team_shots_on_target_over45_percentage_home": 100,
                    "team_shots_on_target_over55_percentage_home": 33,
                    "team_shots_on_target_over65_percentage_home": 33,
                    "team_shots_on_target_over35_percentage_away": 0,
                    "team_shots_on_target_over45_percentage_away": 0,
                    "team_shots_on_target_over55_percentage_away": 0,
                    "team_shots_on_target_over65_percentage_away": 0,
                    "win_0_10_num_overall": 0,
                    "win_0_10_num_home": 0,
                    "win_0_10_num_away": 0,
                    "draw_0_10_num_overall": 5,
                    "draw_0_10_num_home": 3,
                    "draw_0_10_num_away": 2,
                    "loss_0_10_num_overall": 0,
                    "loss_0_10_num_home": 0,
                    "loss_0_10_num_away": 0,
                    "win_0_10_percentage_overall": 0,
                    "win_0_10_percentage_home": 0,
                    "win_0_10_percentage_away": 0,
                    "draw_0_10_percentage_overall": 100,
                    "draw_0_10_percentage_home": 100,
                    "draw_0_10_percentage_away": 100,
                    "loss_0_10_percentage_overall": 0,
                    "loss_0_10_percentage_home": 0,
                    "loss_0_10_percentage_away": 0,
                    "total_goal_over05_0_10_num_overall": 0,
                    "total_goal_over05_0_10_num_home": 0,
                    "total_goal_over05_0_10_num_away": 0,
                    "total_corner_over05_0_10_num_overall": 3,
                    "total_corner_over05_0_10_num_home": 2,
                    "total_corner_over05_0_10_num_away": 1,
                    "total_cards_over05_0_10_num_overall": 1,
                    "total_cards_over05_0_10_num_home": 1,
                    "total_cards_over05_0_10_num_away": 0,
                    "total_goal_over05_0_10_percentage_overall": 0,
                    "total_goal_over05_0_10_percentage_home": 0,
                    "total_goal_over05_0_10_percentage_away": 0,
                    "total_corner_over05_0_10_percentage_overall": 75,
                    "total_corner_over05_0_10_percentage_home": 67,
                    "total_corner_over05_0_10_percentage_away": 100,
                    "total_cards_over05_0_10_percentage_overall": 20,
                    "total_cards_over05_0_10_percentage_home": 33,
                    "total_cards_over05_0_10_percentage_away": 0,
                    "fouls_recorded_overall": 4,
                    "fouls_recorded_home": 3,
                    "fouls_recorded_away": 1,
                    "fouls_against_num_overall": 50,
                    "fouls_against_num_home": 41,
                    "fouls_against_num_away": 9,
                    "fouls_against_avg_overall": 12.5,
                    "fouls_against_avg_home": 13.67,
                    "fouls_against_avg_away": 9,
                    "exact_team_goals_0_ft_percentage_overall": 20,
                    "exact_team_goals_1_ft_percentage_overall": 20,
                    "exact_team_goals_2_ft_percentage_overall": 40,
                    "exact_team_goals_3_ft_percentage_overall": 20,
                    "exact_team_goals_0_ft_percentage_home": 0,
                    "exact_team_goals_1_ft_percentage_home": 33,
                    "exact_team_goals_2_ft_percentage_home": 67,
                    "exact_team_goals_3_ft_percentage_home": 0,
                    "exact_team_goals_0_ft_percentage_away": 50,
                    "exact_team_goals_1_ft_percentage_away": 0,
                    "exact_team_goals_2_ft_percentage_away": 0,
                    "exact_team_goals_3_ft_percentage_away": 50,
                    "exact_total_goals_0_ft_overall": 1,
                    "exact_total_goals_1_ft_overall": 1,
                    "exact_total_goals_2_ft_overall": 1,
                    "exact_total_goals_3_ft_overall": 2,
                    "exact_total_goals_4_ft_overall": 0,
                    "exact_total_goals_5_ft_overall": 0,
                    "exact_total_goals_6_ft_overall": 0,
                    "exact_total_goals_7_ft_overall": 0,
                    "exact_total_goals_0_ft_home": 0,
                    "exact_total_goals_1_ft_home": 1,
                    "exact_total_goals_2_ft_home": 1,
                    "exact_total_goals_3_ft_home": 1,
                    "exact_total_goals_4_ft_home": 0,
                    "exact_total_goals_5_ft_home": 0,
                    "exact_total_goals_6_ft_home": 0,
                    "exact_total_goals_7_ft_home": 0,
                    "exact_total_goals_0_ft_away": 1,
                    "exact_total_goals_1_ft_away": 0,
                    "exact_total_goals_2_ft_away": 0,
                    "exact_total_goals_3_ft_away": 1,
                    "exact_total_goals_4_ft_away": 0,
                    "exact_total_goals_5_ft_away": 0,
                    "exact_total_goals_6_ft_away": 0,
                    "exact_total_goals_7_ft_away": 0,
                    "shots_recorded_matches_num_overall": 4,
                    "shots_recorded_matches_num_home": 3,
                    "shots_recorded_matches_num_away": 1,
                    "over25_and_btts_num_overall": 1,
                    "over25_and_btts_num_home": 1,
                    "over25_and_btts_num_away": 0,
                    "over25_and_no_btts_num_overall": 1,
                    "over25_and_no_btts_num_home": 0,
                    "over25_and_no_btts_num_away": 1,
                    "over25_and_btts_percentage_overall": 20,
                    "over25_and_btts_percentage_home": 33,
                    "over25_and_btts_percentage_away": 0,
                    "over25_and_no_btts_percentage_overall": 20,
                    "over25_and_no_btts_percentage_home": 0,
                    "over25_and_no_btts_percentage_away": 50,
                    "btts_1h2h_yes_yes_num_overall": 0,
                    "btts_1h2h_yes_yes_num_home": 0,
                    "btts_1h2h_yes_yes_num_away": 0,
                    "btts_1h2h_yes_no_num_overall": 1,
                    "btts_1h2h_yes_no_num_home": 1,
                    "btts_1h2h_yes_no_num_away": 0,
                    "btts_1h2h_no_no_num_overall": 4,
                    "btts_1h2h_no_no_num_home": 2,
                    "btts_1h2h_no_no_num_away": 2,
                    "btts_1h2h_no_yes_num_overall": 0,
                    "btts_1h2h_no_yes_num_home": 0,
                    "btts_1h2h_no_yes_num_away": 0,
                    "half_with_most_goals_is_1h_num_overall": 3,
                    "half_with_most_goals_is_1h_num_home": 3,
                    "half_with_most_goals_is_1h_num_away": 0,
                    "half_with_most_goals_is_2h_num_overall": 1,
                    "half_with_most_goals_is_2h_num_home": 0,
                    "half_with_most_goals_is_2h_num_away": 1,
                    "half_with_most_goals_is_tie_num_overall": 1,
                    "half_with_most_goals_is_tie_num_home": 0,
                    "half_with_most_goals_is_tie_num_away": 1,
                    "half_with_most_goals_is_1h_percentage_overall": 60,
                    "half_with_most_goals_is_1h_percentage_home": 100,
                    "half_with_most_goals_is_1h_percentage_away": 0,
                    "half_with_most_goals_is_2h_percentage_overall": 20,
                    "half_with_most_goals_is_2h_percentage_away": 50,
                    "half_with_most_goals_is_tie_percentage_overall": 20,
                    "half_with_most_goals_is_tie_percentage_home": 0,
                    "half_with_most_goals_is_tie_percentage_away": 50,
                    "btts_1h2h_yes_yes_percentage_overall": 0,
                    "btts_1h2h_yes_yes_percentage_home": 0,
                    "btts_1h2h_yes_yes_percentage_away": 0,
                    "btts_1h2h_yes_no_percentage_overall": 20,
                    "btts_1h2h_yes_no_percentage_home": 33,
                    "btts_1h2h_yes_no_percentage_away": 0,
                    "btts_1h2h_no_no_percentage_overall": 80,
                    "btts_1h2h_no_no_percentage_home": 67,
                    "btts_1h2h_no_no_percentage_away": 100,
                    "btts_1h2h_no_yes_percentage_overall": 0,
                    "btts_1h2h_no_yes_percentage_home": 0,
                    "btts_1h2h_no_yes_percentage_away": 0,
                    "half_with_most_goals_is_2h_percentage_home": 0,
                    "shots_per_goals_scored_overall": 7.4,
                    "shots_per_goals_scored_home": 6.2,
                    "shots_per_goals_scored_away": 0,
                    "shots_on_target_per_goals_scored_overall": 4,
                    "shots_on_target_per_goals_scored_home": 3.4,
                    "shots_on_target_per_goals_scored_away": 0,
                    "shot_conversion_rate_overall": 14.000000000000002,
                    "shot_conversion_rate_home": 16,
                    "shot_conversion_rate_away": 0,
                    "team_with_most_corners_win_num_overall": 3,
                    "team_with_most_corners_win_num_home": 3,
                    "team_with_most_corners_win_num_away": 0,
                    "team_with_most_corners_win_1h_num_overall": 3,
                    "team_with_most_corners_win_1h_num_home": 3,
                    "team_with_most_corners_win_1h_num_away": 0,
                    "team_with_most_corners_win_2h_num_overall": 2,
                    "team_with_most_corners_win_2h_num_home": 2,
                    "team_with_most_corners_win_2h_num_away": 0,
                    "team_with_most_corners_win_percentage_overall": 75,
                    "team_with_most_corners_win_percentage_home": 100,
                    "team_with_most_corners_win_percentage_away": 0,
                    "team_with_most_corners_win_1h_percentage_overall": 75,
                    "team_with_most_corners_win_1h_percentage_home": 100,
                    "team_with_most_corners_win_1h_percentage_away": 0,
                    "team_with_most_corners_win_2h_percentage_overall": 50,
                    "team_with_most_corners_win_2h_percentage_home": 67,
                    "team_with_most_corners_win_2h_percentage_away": 0,
                    "half_with_most_corners_is_1h_num_overall": 0,
                    "half_with_most_corners_is_1h_num_home": 0,
                    "half_with_most_corners_is_1h_num_away": 0,
                    "half_with_most_corners_is_2h_num_overall": 3,
                    "half_with_most_corners_is_2h_num_home": 2,
                    "half_with_most_corners_is_2h_num_away": 1,
                    "half_with_most_corners_is_draw_num_overall": 1,
                    "half_with_most_corners_is_draw_num_home": 1,
                    "half_with_most_corners_is_draw_num_away": 0,
                    "half_with_most_corners_is_1h_percentage_overall": 0,
                    "half_with_most_corners_is_1h_percentage_home": 0,
                    "half_with_most_corners_is_1h_percentage_away": 0,
                    "half_with_most_corners_is_2h_percentage_overall": 75,
                    "half_with_most_corners_is_2h_percentage_home": 67,
                    "half_with_most_corners_is_2h_percentage_away": 100,
                    "half_with_most_corners_is_draw_percentage_overall": 25,
                    "half_with_most_corners_is_draw_percentage_home": 33,
                    "half_with_most_corners_is_draw_percentage_away": 0,
                    "corners_earned_1h_num_overall": 9,
                    "corners_earned_1h_num_home": 7,
                    "corners_earned_1h_num_away": 2,
                    "corners_earned_2h_num_overall": 17,
                    "corners_earned_2h_num_home": 15,
                    "corners_earned_2h_num_away": 2,
                    "corners_earned_1h_avg_overall": 2.25,
                    "corners_earned_1h_avg_home": 2.33,
                    "corners_earned_1h_avg_away": 2,
                    "corners_earned_2h_avg_overall": 4.25,
                    "corners_earned_2h_avg_home": 5,
                    "corners_earned_2h_avg_away": 2,
                    "corners_earned_1h_over2_num_overall": 1,
                    "corners_earned_1h_over2_num_home": 1,
                    "corners_earned_1h_over2_num_away": 0,
                    "corners_earned_1h_over3_num_overall": 0,
                    "corners_earned_1h_over3_num_home": 0,
                    "corners_earned_1h_over3_num_away": 0,
                    "corners_earned_2h_over2_num_overall": 2,
                    "corners_earned_2h_over2_num_home": 2,
                    "corners_earned_2h_over2_num_away": 0,
                    "corners_earned_2h_over3_num_overall": 2,
                    "corners_earned_2h_over3_num_home": 2,
                    "corners_earned_2h_over3_num_away": 0,
                    "corners_earned_1h_2_to_3_num_overall": 4,
                    "corners_earned_1h_2_to_3_num_home": 3,
                    "corners_earned_1h_2_to_3_num_away": 1,
                    "corners_earned_2h_2_to_3_num_overall": 1,
                    "corners_earned_2h_2_to_3_num_home": 0,
                    "corners_earned_2h_2_to_3_num_away": 1,
                    "corners_earned_1h_over2_percentage_overall": 25,
                    "corners_earned_1h_over2_percentage_home": 33,
                    "corners_earned_1h_over2_percentage_away": 0,
                    "corners_earned_1h_over3_percentage_overall": 0,
                    "corners_earned_1h_over3_percentage_home": 0,
                    "corners_earned_1h_over3_percentage_away": 0,
                    "corners_earned_2h_over2_percentage_overall": 50,
                    "corners_earned_2h_over2_percentage_home": 67,
                    "corners_earned_2h_over2_percentage_away": 0,
                    "corners_earned_2h_over3_percentage_overall": 50,
                    "corners_earned_2h_over3_percentage_home": 67,
                    "corners_earned_2h_over3_percentage_away": 0,
                    "corners_earned_1h_2_to_3_percentage_overall": 100,
                    "corners_earned_1h_2_to_3_percentage_home": 100,
                    "corners_earned_1h_2_to_3_percentage_away": 100,
                    "corners_earned_2h_2_to_3_percentage_overall": 25,
                    "corners_earned_2h_2_to_3_percentage_home": 0,
                    "corners_earned_2h_2_to_3_percentage_away": 100,
                    "penalties_conceded_overall": 0,
                    "penalties_conceded_home": 0,
                    "penalties_conceded_away": 0,
                    "penalty_in_a_match_overall": 1,
                    "penalty_in_a_match_home": 0,
                    "penalty_in_a_match_away": 1,
                    "penalty_in_a_match_percentage_overall": 20,
                    "penalty_in_a_match_percentage_home": 0,
                    "penalty_in_a_match_percentage_away": 50,
                    "goal_kicks_recorded_matches_overall": 4,
                    "goal_kicks_recorded_matches_home": 3,
                    "goal_kicks_recorded_matches_away": 1,
                    "goal_kicks_team_num_overall": 27,
                    "goal_kicks_team_num_home": 17,
                    "goal_kicks_team_num_away": 10,
                    "goal_kicks_total_num_overall": 64,
                    "goal_kicks_total_num_home": 51,
                    "goal_kicks_total_num_away": 13,
                    "goal_kicks_team_avg_overall": 6.75,
                    "goal_kicks_team_avg_home": 5.67,
                    "goal_kicks_team_avg_away": 10,
                    "goal_kicks_total_avg_overall": 16,
                    "goal_kicks_total_avg_home": 17,
                    "goal_kicks_total_avg_away": 13,
                    "goal_kicks_team_over35_overall": 75,
                    "goal_kicks_team_over35_home": 67,
                    "goal_kicks_team_over35_away": 100,
                    "goal_kicks_team_over45_overall": 75,
                    "goal_kicks_team_over45_home": 67,
                    "goal_kicks_team_over45_away": 100,
                    "goal_kicks_team_over55_overall": 75,
                    "goal_kicks_team_over55_home": 67,
                    "goal_kicks_team_over55_away": 100,
                    "goal_kicks_team_over65_overall": 75,
                    "goal_kicks_team_over65_home": 67,
                    "goal_kicks_team_over65_away": 100,
                    "goal_kicks_team_over75_overall": 50,
                    "goal_kicks_team_over75_home": 33,
                    "goal_kicks_team_over75_away": 100,
                    "goal_kicks_team_over85_overall": 25,
                    "goal_kicks_team_over85_home": 0,
                    "goal_kicks_team_over85_away": 100,
                    "goal_kicks_team_over95_overall": 25,
                    "goal_kicks_team_over95_home": 0,
                    "goal_kicks_team_over95_away": 100,
                    "goal_kicks_team_over105_overall": 0,
                    "goal_kicks_team_over105_home": 0,
                    "goal_kicks_team_over105_away": 0,
                    "goal_kicks_team_over115_overall": 0,
                    "goal_kicks_team_over115_home": 0,
                    "goal_kicks_team_over115_away": 0,
                    "goal_kicks_total_over85_overall": 100,
                    "goal_kicks_total_over85_home": 100,
                    "goal_kicks_total_over85_away": 100,
                    "goal_kicks_total_over95_overall": 100,
                    "goal_kicks_total_over95_home": 100,
                    "goal_kicks_total_over95_away": 100,
                    "goal_kicks_total_over105_overall": 100,
                    "goal_kicks_total_over105_home": 100,
                    "goal_kicks_total_over105_away": 100,
                    "goal_kicks_total_over115_overall": 100,
                    "goal_kicks_total_over115_home": 100,
                    "goal_kicks_total_over115_away": 100,
                    "goal_kicks_total_over125_overall": 100,
                    "goal_kicks_total_over125_home": 100,
                    "goal_kicks_total_over125_away": 100,
                    "goal_kicks_total_over135_overall": 75,
                    "goal_kicks_total_over135_home": 100,
                    "goal_kicks_total_over135_away": 0,
                    "goal_kicks_total_over145_overall": 50,
                    "goal_kicks_total_over145_home": 67,
                    "goal_kicks_total_over145_away": 0,
                    "goal_kicks_total_over155_overall": 50,
                    "goal_kicks_total_over155_home": 67,
                    "goal_kicks_total_over155_away": 0,
                    "goal_kicks_total_over165_overall": 50,
                    "goal_kicks_total_over165_home": 67,
                    "goal_kicks_total_over165_away": 0,
                    "goal_kicks_total_over175_overall": 50,
                    "goal_kicks_total_over175_home": 67,
                    "goal_kicks_total_over175_away": 0,
                    "goal_kicks_total_over185_overall": 25,
                    "goal_kicks_total_over185_home": 33,
                    "goal_kicks_total_over185_away": 0,
                    "throwins_recorded_matches_overall": 4,
                    "throwins_recorded_matches_home": 3,
                    "throwins_recorded_matches_away": 1,
                    "throwins_team_num_overall": 63,
                    "throwins_team_num_home": 57,
                    "throwins_team_num_away": 6,
                    "throwins_total_num_overall": 133,
                    "throwins_total_num_home": 113,
                    "throwins_total_num_away": 20,
                    "throwins_team_avg_overall": 15.75,
                    "throwins_team_avg_home": 19,
                    "throwins_team_avg_away": 6,
                    "throwins_total_avg_overall": 33.25,
                    "throwins_total_avg_home": 37.67,
                    "throwins_total_avg_away": 20,
                    "throwins_team_over155_overall": 25,
                    "throwins_team_over155_home": 33,
                    "throwins_team_over155_away": 0,
                    "throwins_team_over165_overall": 25,
                    "throwins_team_over165_home": 33,
                    "throwins_team_over165_away": 0,
                    "throwins_team_over175_overall": 25,
                    "throwins_team_over175_home": 33,
                    "throwins_team_over175_away": 0,
                    "throwins_team_over185_overall": 25,
                    "throwins_team_over185_home": 33,
                    "throwins_team_over185_away": 0,
                    "throwins_team_over195_overall": 25,
                    "throwins_team_over195_home": 33,
                    "throwins_team_over195_away": 0,
                    "throwins_team_over205_overall": 25,
                    "throwins_team_over205_home": 33,
                    "throwins_team_over205_away": 0,
                    "throwins_team_over215_overall": 25,
                    "throwins_team_over215_home": 33,
                    "throwins_team_over215_away": 0,
                    "throwins_team_over225_overall": 25,
                    "throwins_team_over225_home": 33,
                    "throwins_team_over225_away": 0,
                    "throwins_team_over235_overall": 25,
                    "throwins_team_over235_home": 33,
                    "throwins_team_over235_away": 0,
                    "throwins_team_over245_overall": 25,
                    "throwins_team_over245_home": 33,
                    "throwins_team_over245_away": 0,
                    "throwins_team_over255_overall": 25,
                    "throwins_team_over255_home": 33,
                    "throwins_team_over255_away": 0,
                    "throwins_total_over375_overall": 25,
                    "throwins_total_over375_home": 33,
                    "throwins_total_over375_away": 0,
                    "throwins_total_over385_overall": 25,
                    "throwins_total_over385_home": 33,
                    "throwins_total_over385_away": 0,
                    "throwins_total_over395_overall": 25,
                    "throwins_total_over395_home": 33,
                    "throwins_total_over395_away": 0,
                    "throwins_total_over405_overall": 25,
                    "throwins_total_over405_home": 33,
                    "throwins_total_over405_away": 0,
                    "throwins_total_over415_overall": 25,
                    "throwins_total_over415_home": 33,
                    "throwins_total_over415_away": 0,
                    "throwins_total_over425_overall": 25,
                    "throwins_total_over425_home": 33,
                    "throwins_total_over425_away": 0,
                    "throwins_total_over435_overall": 25,
                    "throwins_total_over435_home": 33,
                    "throwins_total_over435_away": 0,
                    "throwins_total_over445_overall": 25,
                    "throwins_total_over445_home": 33,
                    "throwins_total_over445_away": 0,
                    "throwins_total_over455_overall": 25,
                    "throwins_total_over455_home": 33,
                    "throwins_total_over455_away": 0,
                    "throwins_total_over465_overall": 25,
                    "throwins_total_over465_home": 33,
                    "throwins_total_over465_away": 0,
                    "throwins_total_over475_overall": 25,
                    "throwins_total_over475_home": 33,
                    "throwins_total_over475_away": 0,
                    "freekicks_recorded_matches_overall": 4,
                    "freekicks_recorded_matches_home": 3,
                    "freekicks_recorded_matches_away": 1,
                    "freekicks_team_num_overall": 46,
                    "freekicks_team_num_home": 35,
                    "freekicks_team_num_away": 11,
                    "freekicks_total_num_overall": 107,
                    "freekicks_total_num_home": 75,
                    "freekicks_total_num_away": 32,
                    "freekicks_team_avg_overall": 11.5,
                    "freekicks_team_avg_home": 11.67,
                    "freekicks_team_avg_away": 11,
                    "freekicks_total_avg_overall": 26.75,
                    "freekicks_total_avg_home": 25,
                    "freekicks_total_avg_away": 32,
                    "freekicks_team_over75_overall": 100,
                    "freekicks_team_over75_home": 100,
                    "freekicks_team_over75_away": 100,
                    "freekicks_team_over85_overall": 100,
                    "freekicks_team_over85_home": 100,
                    "freekicks_team_over85_away": 100,
                    "freekicks_team_over95_overall": 75,
                    "freekicks_team_over95_home": 67,
                    "freekicks_team_over95_away": 100,
                    "freekicks_team_over105_overall": 75,
                    "freekicks_team_over105_home": 67,
                    "freekicks_team_over105_away": 100,
                    "freekicks_team_over115_overall": 25,
                    "freekicks_team_over115_home": 33,
                    "freekicks_team_over115_away": 0,
                    "freekicks_team_over125_overall": 25,
                    "freekicks_team_over125_home": 33,
                    "freekicks_team_over125_away": 0,
                    "freekicks_team_over135_overall": 25,
                    "freekicks_team_over135_home": 33,
                    "freekicks_team_over135_away": 0,
                    "freekicks_team_over145_overall": 25,
                    "freekicks_team_over145_home": 33,
                    "freekicks_team_over145_away": 0,
                    "freekicks_team_over155_overall": 0,
                    "freekicks_team_over155_home": 0,
                    "freekicks_team_over155_away": 0,
                    "freekicks_team_over165_overall": 0,
                    "freekicks_team_over165_home": 0,
                    "freekicks_team_over165_away": 0,
                    "freekicks_team_over175_overall": 0,
                    "freekicks_team_over175_home": 0,
                    "freekicks_team_over175_away": 0,
                    "freekicks_total_over205_overall": 75,
                    "freekicks_total_over205_home": 67,
                    "freekicks_total_over205_away": 100,
                    "freekicks_total_over215_overall": 75,
                    "freekicks_total_over215_home": 67,
                    "freekicks_total_over215_away": 100,
                    "freekicks_total_over225_overall": 50,
                    "freekicks_total_over225_home": 33,
                    "freekicks_total_over225_away": 100,
                    "freekicks_total_over235_overall": 50,
                    "freekicks_total_over235_home": 33,
                    "freekicks_total_over235_away": 100,
                    "freekicks_total_over245_overall": 50,
                    "freekicks_total_over245_home": 33,
                    "freekicks_total_over245_away": 100,
                    "freekicks_total_over255_overall": 50,
                    "freekicks_total_over255_home": 33,
                    "freekicks_total_over255_away": 100,
                    "freekicks_total_over265_overall": 50,
                    "freekicks_total_over265_home": 33,
                    "freekicks_total_over265_away": 100,
                    "freekicks_total_over275_overall": 50,
                    "freekicks_total_over275_home": 33,
                    "freekicks_total_over275_away": 100,
                    "freekicks_total_over285_overall": 50,
                    "freekicks_total_over285_home": 33,
                    "freekicks_total_over285_away": 100,
                    "freekicks_total_over295_overall": 50,
                    "freekicks_total_over295_home": 33,
                    "freekicks_total_over295_away": 100,
                    "freekicks_total_over305_overall": 50,
                    "freekicks_total_over305_home": 33,
                    "freekicks_total_over305_away": 100
                },
                "goals_scored_min_0_to_10": 0,
                "goals_conceded_min_0_to_10": 0,
                "goals_scored_min_11_to_20": 1,
                "goals_conceded_min_11_to_20": 0,
                "goals_scored_min_21_to_30": 1,
                "goals_conceded_min_21_to_30": 0,
                "goals_scored_min_31_to_40": 1,
                "goals_conceded_min_31_to_40": 0,
                "goals_scored_min_41_to_50": 2,
                "goals_conceded_min_41_to_50": 1,
                "goals_scored_min_51_to_60": 0,
                "goals_conceded_min_51_to_60": 0,
                "goals_scored_min_61_to_70": 1,
                "goals_conceded_min_61_to_70": 0,
                "goals_scored_min_71_to_80": 0,
                "goals_conceded_min_71_to_80": 0,
                "goals_scored_min_81_to_90": 2,
                "goals_conceded_min_81_to_90": 0,
                "goals_all_min_0_to_10": 0,
                "goals_all_min_11_to_20": 1,
                "goals_all_min_21_to_30": 1,
                "goals_all_min_31_to_40": 1,
                "goals_all_min_41_to_50": 3,
                "goals_all_min_51_to_60": 0,
                "goals_all_min_61_to_70": 1,
                "goals_all_min_71_to_80": 0,
                "goals_all_min_81_to_90": 2,
                "goals_all_min_0_to_15": 0,
                "goals_all_min_16_to_30": 2,
                "goals_all_min_31_to_45": 4,
                "goals_all_min_46_to_60": 0,
                "goals_all_min_61_to_75": 1,
                "goals_all_min_76_to_90": 2,
                "goals_scored_min_0_to_15": 0,
                "goals_scored_min_16_to_30": 2,
                "goals_scored_min_31_to_45": 3,
                "goals_scored_min_46_to_60": 0,
                "goals_scored_min_61_to_75": 1,
                "goals_scored_min_76_to_90": 2,
                "goals_conceded_min_0_to_15": 0,
                "goals_conceded_min_16_to_30": 0,
                "goals_conceded_min_31_to_45": 1,
                "goals_conceded_min_46_to_60": 0,
                "goals_conceded_min_61_to_75": 0,
                "goals_conceded_min_76_to_90": 0,
                "goals_scored_min_0_to_10_home": 0,
                "goals_scored_min_11_to_20_home": 1,
                "goals_scored_min_21_to_30_home": 1,
                "goals_scored_min_31_to_40_home": 0,
                "goals_scored_min_41_to_50_home": 2,
                "goals_scored_min_51_to_60_home": 0,
                "goals_scored_min_61_to_70_home": 0,
                "goals_scored_min_71_to_80_home": 0,
                "goals_scored_min_81_to_90_home": 1,
                "goals_scored_min_0_to_15_home": 0,
                "goals_scored_min_16_to_30_home": 2,
                "goals_scored_min_31_to_45_home": 2,
                "goals_scored_min_46_to_60_home": 0,
                "goals_scored_min_61_to_75_home": 0,
                "goals_scored_min_76_to_90_home": 1,
                "goals_conceded_min_0_to_10_home": 0,
                "goals_conceded_min_11_to_20_home": 0,
                "goals_conceded_min_21_to_30_home": 0,
                "goals_conceded_min_31_to_40_home": 0,
                "goals_conceded_min_41_to_50_home": 1,
                "goals_conceded_min_51_to_60_home": 0,
                "goals_conceded_min_61_to_70_home": 0,
                "goals_conceded_min_71_to_80_home": 0,
                "goals_conceded_min_81_to_90_home": 0,
                "goals_conceded_min_0_to_15_home": 0,
                "goals_conceded_min_16_to_30_home": 0,
                "goals_conceded_min_31_to_45_home": 1,
                "goals_conceded_min_46_to_60_home": 0,
                "goals_conceded_min_61_to_75_home": 0,
                "goals_conceded_min_76_to_90_home": 0,
                "goals_all_min_0_to_10_home": 0,
                "goals_all_min_11_to_20_home": 1,
                "goals_all_min_21_to_30_home": 1,
                "goals_all_min_31_to_40_home": 0,
                "goals_all_min_41_to_50_home": 3,
                "goals_all_min_51_to_60_home": 0,
                "goals_all_min_61_to_70_home": 0,
                "goals_all_min_71_to_80_home": 0,
                "goals_all_min_81_to_90_home": 1,
                "goals_all_min_0_to_15_home": 0,
                "goals_all_min_16_to_30_home": 2,
                "goals_all_min_31_to_45_home": 3,
                "goals_all_min_46_to_60_home": 0,
                "goals_all_min_61_to_75_home": 0,
                "goals_all_min_76_to_90_home": 1,
                "goals_scored_min_0_to_10_away": 0,
                "goals_scored_min_11_to_20_away": 0,
                "goals_scored_min_21_to_30_away": 0,
                "goals_scored_min_31_to_40_away": 1,
                "goals_scored_min_41_to_50_away": 0,
                "goals_scored_min_51_to_60_away": 0,
                "goals_scored_min_61_to_70_away": 1,
                "goals_scored_min_71_to_80_away": 0,
                "goals_scored_min_81_to_90_away": 1,
                "goals_scored_min_0_to_15_away": 0,
                "goals_scored_min_16_to_30_away": 0,
                "goals_scored_min_31_to_45_away": 1,
                "goals_scored_min_46_to_60_away": 0,
                "goals_scored_min_61_to_75_away": 1,
                "goals_scored_min_76_to_90_away": 1,
                "goals_conceded_min_0_to_10_away": 0,
                "goals_conceded_min_11_to_20_away": 0,
                "goals_conceded_min_21_to_30_away": 0,
                "goals_conceded_min_31_to_40_away": 0,
                "goals_conceded_min_41_to_50_away": 0,
                "goals_conceded_min_51_to_60_away": 0,
                "goals_conceded_min_61_to_70_away": 0,
                "goals_conceded_min_71_to_80_away": 0,
                "goals_conceded_min_81_to_90_away": 0,
                "goals_conceded_min_0_to_15_away": 0,
                "goals_conceded_min_16_to_30_away": 0,
                "goals_conceded_min_31_to_45_away": 0,
                "goals_conceded_min_46_to_60_away": 0,
                "goals_conceded_min_61_to_75_away": 0,
                "goals_conceded_min_76_to_90_away": 0,
                "goals_all_min_0_to_10_away": 0,
                "goals_all_min_11_to_20_away": 0,
                "goals_all_min_21_to_30_away": 0,
                "goals_all_min_31_to_40_away": 1,
                "goals_all_min_41_to_50_away": 0,
                "goals_all_min_51_to_60_away": 0,
                "goals_all_min_61_to_70_away": 1,
                "goals_all_min_71_to_80_away": 0,
                "goals_all_min_81_to_90_away": 1,
                "goals_all_min_0_to_15_away": 0,
                "goals_all_min_16_to_30_away": 0,
                "goals_all_min_31_to_45_away": 1,
                "goals_all_min_46_to_60_away": 0,
                "goals_all_min_61_to_75_away": 1,
                "goals_all_min_76_to_90_away": 1,
                "last_x": "5",
                "name_jp": "アーセナルFC",
                "name_tr": "Arsenal FC",
                "name_kr": "아스날",
                "name_pt": "Arsenal",
                "name_ru": "Арсенал",
                "name_es": "Arsenal FC",
                "name_se": "Arsenal",
                "name_de": "Arsenal FC",
                "name_zht": "阿森納",
                "name_nl": "Arsenal FC",
                "name_it": "Arsenal FC",
                "name_fr": "Arsenal FC",
                "name_id": "Arsenal FC",
                "name_pl": "Arsenal FC",
                "name_gr": "Αρσεναλ",
                "name_dk": "Arsenal FC",
                "name_th": "อาร์เซนอล",
                "name_hr": "Arsenal FC",
                "name_ro": "Arsenal FC",
                "name_in": "Arsenal FC",
                "name_no": "Arsenal FC",
                "name_hu": "Arsenal FC",
                "name_cz": "Arsenal FC",
                "name_cn": "阿森纳",
                "name_ara": "نادي أرسنال",
                "name_si": null,
                "name_vn": "Arsenal FC",
                "name_my": null,
                "name_sk": "Arsenal FC",
                "name_rs": null,
                "name_ua": null,
                "name_bg": "Arsenal FC",
                "name_lv": null,
                "name_ge": null,
                "name_swa": null,
                "name_kur": null,
                "name_ee": null,
                "name_lt": null,
                "name_ba": null,
                "name_by": null,
                "name_fi": "Arsenal FC",
                "women": null,
                "parent_url": null,
                "prediction_risk": 20
            }
        }
    ]
}
Queries and Parameters
This table only contains attibutes that are Unique to this endpoint.

Variable Name
Description
id
ID of the Team.
name / full_name / english_name
Name of the Team.
country
Country of the Team.
stats
Contains an array of Stats for the corresponding team.
competition_id
ID of the Competition in which the team is playing.
url
Corresponding FootyStats url.
founded
Foundation year of the team.
season
Latest season participating in.
table_position
Position in the league.
performance_rank
PPG rating within the league.
season_format
Format of the season.
official_sites
Official website url of the team.
risk
Prediction risk, it represents how often a team scores or concedes goals within close proximity of each other.
suspended_matches
Number of matches suspended.
homeOverallAdvantage / homeDefenceAdvantage / homeAttackAdvantage
Advantage this team has in attack.
Overall = all games, home = home games only, away = away games only.
seasonGoals_overall
Number of goals scored this season.
seasonConceded_overall
Number of goals conceded this season.
seasonGoalsTotal_overall / home / away
Number of goal event recorded when playing Home or Away.
Overall = all games, home = home games only, away = away games only.
seasonConcededNum_home / seasonConcededNum_away
Number of goals conceded this season.
Home = home games only, away = away games only.
seasonGoalsMin_overall / home / away
Average goals per minutes.
Overall = all games, home = home games only, away = away games only.
seasonConcededMin_overall / home / away
Average goals conceded per minutes.
Overall = all games, home = home games only, away = away games only.
seasonGoalDifference_overall / home / away
Goal difference.
Overall = all games, home = home games only, away = away games only.
seasonWinsNum_overall / home / away
Number of wins in the season.
Overall = all games, home = home games only, away = away games only.
seasonDrawsNum_overall / home / away
Number of draws in the season.
Overall = all games, home = home games only, away = away games only.
seasonLossesNum_overall / home / away
Number of losses in the season.
Overall = all games, home = home games only, away = away games only.
seasonMatchesPlayed_overall / home / away
Number of match played in the season.
Overall = all games, home = home games only, away = away games only.
seasonHighestScored_home / seasonHighestScored_away
Highest number of goals scored.
Home = home games only, away = away games only.
seasonHighestConceded_home / seasonHighestConceded_away
Highest number of goals conceded.
Home = home games only, away = away games only.
seasonCS_overall / home / away
Season's clean sheets.
Overall = all games, home = home games only, away = away games only.
seasonCSPercentage_overall / home / away
Season's clean sheets percentage.
Overall = all games, home = home games only, away = away games only.
seasonCSHT_overall / home / away
Season's clean sheets at half-time.
Overall = all games, home = home games only, away = away games only.
seasonCSPercentageHT_overall / home / away
Season's clean sheets percentage at half-time.
Overall = all games, home = home games only, away = away games only.
seasonFTS_overall / home / away
Season's Failed To Score.
Overall = all games, home = home games only, away = away games only.
seasonFTSPercentage_overall / home / away
Season's Failed To Score percentage.
Overall = all games, home = home games only, away = away games only.
seasonFTS_home / seasonFTS_away
Season's Failed to score.
Home = home games only, away = away games only.
seasonFTSHT_overall / home / away
Season's Failed to score at half-time.
Overall = all games, home = home games only, away = away games only.
seasonFTSPercentageHT_overall / home / away
Season's Failed to score at half-time percentage.
Overall = all games, home = home games only, away = away games only.
seasonBTTS_overall / home / away
Season's both teams to score.
Overall = all games, home = home games only, away = away games only.
seasonBTTSPercentage_overall / home / away
Season's both teams to score percentage.
Overall = all games, home = home games only, away = away games only.
seasonBTTSHT_overall / home / away
Season's both teams to score at half-time.
Overall = all games, home = home games only, away = away games only.
seasonBTTSPercentageHT_overall / home / away
Season's both teams to score at half-time percentage.
Overall = all games, home = home games only, away = away games only.
seasonPPG_overall / home / away
Season's points per game, Win = 3 points, Draw = 1 point.
Overall = all games, home = home games only, away = away games only.
seasonAVG_overall / home / away
Season's average goals scored + conceded per game.
Overall = all games, home = home games only, away = away games only.
seasonAVG_overall / home / away
Season's average goals scored per game.
Overall = all games, home = home games only, away = away games only.
seasonConcededAVG_overall / home / away
Season's average goals conceded per game.
Overall = all games, home = home games only, away = away games only.
winPercentage_overall / home / away
Season's average win percentage.
Overall = all games, home = home games only, away = away games only.
drawPercentage_overall / home / away
Season's average draw percentage.
Overall = all games, home = home games only, away = away games only.
losePercentage_overall / home / away
Season's average loss percentage.
Overall = all games, home = home games only, away = away games only.
leadingAtHT_overall / home / away
Season's leading at half-time count.
Overall = all games, home = home games only, away = away games only.
leadingAtHTPercentage_overall / home / away
Season's leading at half-time percentage.
Overall = all games, home = home games only, away = away games only.
drawingAtHT_overall / home / away
Season's drawing at half-time.
Overall = all games, home = home games only, away = away games only.
drawingAtHTPercentage_overall / home / away
Season's drawing at half-time percentage.
Overall = all games, home = home games only, away = away games only.
trailingAtHT_overall / home / away
Season's losing at half-time.
Overall = all games, home = home games only, away = away games only.
trailingAtHTPercentage_overall / home / away
Season's losing at half-time percentage.
Overall = all games, home = home games only, away = away games only.
HTPoints_overall / home / away
Season's half-time points.
Overall = all games, home = home games only, away = away games only.
HTPPG_overall / home / away
Season's half-time points per game.
Overall = all games, home = home games only, away = away games only.
scoredAVGHT_overall / home / away
Season's average scored at half-time.
Overall = all games, home = home games only, away = away games only.
concededAVGHT_overall / home / away
Season's average conceded at half-time.
Overall = all games, home = home games only, away = away games only.
AVGHT_overall / home / away
Season's average scored + conceded at half-time.
Overall = all games, home = home games only, away = away games only.
GoalsHT_overall / home / away
Season's average goals at half-time.
Overall = all games, home = home games only, away = away games only.
GoalDifferenceHT_overall / home / away
Season's average goal difference at half-time.
Overall = all games, home = home games only, away = away games only.
seasonOver05Num_overall - seasonOver55Num_overall / home / away
Season's count of Over (0.5 - 5.5) goals.
Overall = all games, home = home games only, away = away games only.
seasonOver05Percentage_overall - seasonOver55Percentage_overall / home / away
Season's percentage of Over (0.5 - 5.5) goals.
Overall = all games, home = home games only, away = away games only.
seasonUnder05Num_overall - seasonUnder55Num_overall / home / away
Season's count of Under (0.5 - 5.5) goals.
Overall = all games, home = home games only, away = away games only.
seasonUnder05Percentage_overall - seasonUnder55Percentage_overall / home / away
Season's percentage of Under (0.5 - 5.5) goals.
Overall = all games, home = home games only, away = away games only.
seasonOver05NumHT_overall - seasonOver25NumHT_overall / home / away
Season's count of Over (0.5 - 5.5) goals at half time.
Overall = all games, home = home games only, away = away games only.
seasonOver05PercentageHT_overall - seasonOver25PercentageHT_overall / home / away
Season's percentage of Over (0.5 - 5.5) goals at half time.
Overall = all games, home = home games only, away = away games only.
cornersRecorded_matches_overall / home / away
Season's corners recorded per matches.
Overall = all games, home = home games only, away = away games only.
over65Corners_overall - over135Corners_overall / home / away
Season's count of Over (6.5 - 13.5) corners.
Overall = all games, home = home games only, away = away games only.
over65CornersPercentage_overall - over135CornersPercentage_overall / home / away
Season's percentage of Over (6.5 - 13.5) corners.
Overall = all games, home = home games only, away = away games only.
over25CornersFor_overall - over85CornersFor_overall / home / away
Season's count of Over (2.5 - 8.5) corners for.
Overall = all games, home = home games only, away = away games only.
over25CornersForPercentage_overall - over65CornersForPercentage_overall / home / away
Season's percentage of Over (2.5 - 8.5) corners for.
Overall = all games, home = home games only, away = away games only.
over25CornersAgainst_overall - over85CornersAgainst_overall / home / away
Season's count of Over (2.5 - 8.5) corners against.
Overall = all games, home = home games only, away = away games only.
over25CornersAgainstPercentage_overall - over65CornersAgainstPercentage_overall / home / away
Season's percentage of Over (2.5 - 8.5) corners against.
Overall = all games, home = home games only, away = away games only.
over05Cards_overall - over85Cards_overall / ohome / away
Season's count of Over (0,5 - 8.5) cards.
Overall = all games, home = home games only, away = away games only.
over05CardsPercentage_overall - over85CardsPercentage_overall / home / away
Season's percentage of Over (0,5 - 8.5) cards.
Overall = all games, home = home games only, away = away games only.
over05CardsFor_overall - over85CardsFor_overall / home / away
Season's count of Over (0,5 - 8.5) cards for.
Overall = all games, home = home games only, away = away games only.
over05CardsForPercentage_overall - over85CardsForPercentage_overall / home / away
Season's percentage of Over (0,5 - 8.5) cards for.
Overall = all games, home = home games only, away = away games only.
over05CardsAgainst_overall - over85CardsAgainst_overall / home / away
Season's count of Over (0,5 - 8.5) cards for.
Overall = all games, home = home games only, away = away games only.
over05CardsAgainstPercentage_overall - over85CardsAgainstPercentage_overall / home / away
Season's percentage of Over (0,5 - 8.5) cards for.
Overall = all games, home = home games only, away = away games only.
leaguePosition_overall / home / away
Season's league position.
Overall = normal league table, home = home table only, away = away table only.
firstGoalScored_overall / home / away
Season's count of first goals scored.
Overall = all games, home = home games only, away = away games only.
firstGoalScoredPercentage_overall / home / away
Season's percentage of first goals scored.
Overall = all games, home = home games only, away = away games only.
cornersTotal_overall / home / away
Season's count of corners.
Overall = all games, home = home games only, away = away games only.
cornersTotalAVG_overall / home / away
Season's average count of corners per match.
Overall = all games, home = home games only, away = away games only.
cornersAVG_overall / home / away
Season's average count of corners.
Overall = all games, home = home games only, away = away games only.
cardsTotal_overall / home / away
Season's count of cards.
Overall = all games, home = home games only, away = away games only.
cardsAVG_overall / home / away
Season's count of cards.
Overall = all games, home = home games only, away = away games only.
cornersHighest_overall / cornersLowest_overall
Season's Highest / Lowest corner counts.
cornersAgainst_overall / home / away
Season's corners against.
Overall = all games, home = home games only, away = away games only.
cornersAgainstAVG_overall / home / away
Season's average corners against.
Overall = all games, home = home games only, away = away games only.
shotsTotal_overall / home / away
Season's shots.
Overall = all games, home = home games only, away = away games only.
shotsAVG_overall / home / away
Season's shots.
Overall = all games, home = home games only, away = away games only.
shotsOnTargetTotal_overall / home / away
Season's shots on target.
Overall = all games, home = home games only, away = away games only.
shotsOffTargetTotal_overall / home / away
Season's shots off target.
Overall = all games, home = home games only, away = away games only.
shotsOnTargetAVG_overall / home / away
Season's shots on target average.
Overall = all games, home = home games only, away = away games only.
shotsOffTargetAVG_overall / home / away
Season's shots off target average.
Overall = all games, home = home games only, away = away games only.
possessionAVG_overall / home / away
Season's possession average.
Overall = all games, home = home games only, away = away games only.
foulsAVG_overall / home / away
Season's fouls average.
Overall = all games, home = home games only, away = away games only.
foulsTotal_overall / fhome / away
Season's total fouls.
Overall = all games, home = home games only, away = away games only.
offsidesTotal_overall / home / away
Season's total offsides.
Overall = all games, home = home games only, away = away games only.
offsidesTeamTotal_overall / home / away
Season's total team offsides.
Overall = all games, home = home games only, away = away games only.
offsidesRecorded_matches_overall / home / away
Season's offsides recorded per match.
Overall = all games, home = home games only, away = away games only.
offsidesAVG_overall / home / away
Season's average offsides.
Overall = all games, home = home games only, away = away games only.
offsidesTeamAVG_overall / home / away
Season's team average offsides.
Overall = all games, home = home games only, away = away games only.
offsidesOver05_overall - offsidesOver65_overall / home / away
Season's count of Over (0,5 - 6.5) offsides.
Overall = all games, home = home games only, away = away games only.
over05OffsidesPercentage_overall - over65OffsidesPercentage_overall / home / away
Season's percentage of Over (0,5 - 6.5) offsides.
Overall = all games, home = home games only, away = away games only.
offsidesTeamOver05_overall - offsidesTeamOver65_overall / home / away
Season's count of Over (0,5 - 6.5) Team offsides.
Overall = all games, home = home games only, away = away games only.
over05OffsidesTeamPercentage_overall - over65OffsidesTeamPercentage_overall / home / away
Season's percentage of Over (0,5 - 6.5) Team offsides.
Overall = all games, home = home games only, away = away games only.
scoredBothHalves_overall / home / away
Season's scored in both halves.
Overall = all games, home = home games only, away = away games only.
scoredBothHalvesPercentage_overall / home / away
Season's scored in both halves percentage.
Overall = all games, home = home games only, away = away games only.
seasonMatchesPlayedGoalTimingRecorded_overall / home / away
Season's matches played goal timing recorded.
Overall = all games, home = home games only, away = away games only.
BTTS_and_win_overall / home / away
Season's both teams to score and win count.
Overall = all games, home = home games only, away = away games only.
BTTS_and_win_percentage_overall / home / away
Season's both teams to score and win percentage.
Overall = all games, home = home games only, away = away games only.
BTTS_and_draw_overall / home / away
Season's both teams to score and draw count.
Overall = all games, home = home games only, away = away games only.
BTTS_and_draw_percentage_overall / home / away
Season's both teams to score and draw percentage.
Overall = all games, home = home games only, away = away games only.
BTTS_and_lose_overall / home / away
Season's both teams to score and lose count.
Overall = all games, home = home games only, away = away games only.
BTTS_and_lose_percentage_overall / home / away
Season's both teams to score and lose percentage.
Overall = all games, home = home games only, away = away games only.
AVG_2hg_overall / home / away
Average second half total goals.
Overall = all games, home = home games only, away = away games only.
scored_2hg_avg_overall / home / away
Average second half goals scored.
Overall = all games, home = home games only, away = away games only.
conceded_2hg_avg_overall / home / away
Average second half goals conceded.
Overall = all games, home = home games only, away = away games only.
total_2hg_overall / home / away
Total second half goals.
Overall = all games, home = home games only, away = away games only.
conceded_2hg_overall / home / away
Total second half goals conceded.
Overall = all games, home = home games only, away = away games only.
scored_2hg_overall / home / away
Total second half goals scored.
Overall = all games, home = home games only, away = away games only.
over05_2hg_num_overall - over25_2hg_num_overall / home / away
Season's count of Over (0,5 - 2.5) second half goals.
Overall = all games, home = home games only, away = away games only.
over05_2hg_percentage_overall - over25_2hg_percentage_overall / home / away
Season's percentage of Over (0,5 - 2.5) second half goals.
Overall = all games, home = home games only, away = away games only.
points_2hg_overall / home / away
Season's points gained in second half.
Overall = all games, home = home games only, away = away games only.
ppg_2hg_overall / home / away
Season's point per game in second half.
Overall = all games, home = home games only, away = away games only.
wins_2hg_overall / home / away
Season's wins in second half.
Overall = all games, home = home games only, away = away games only.
wins_2hg_percentage_overall / home / away
Season's wins percentage in second half.
Overall = all games, home = home games only, away = away games only.
draws_2hg_overall / home / away
Season's draws in second half.
Overall = all games, home = home games only, away = away games only.
draws_2hg_percentage_overall / home / away
Season's draws percentage in second half.
Overall = all games, home = home games only, away = away games only.
losses_2hg_overall / home / away
Season's loses in second half.
Overall = all games, home = home games only, away = away games only.
losses_2hg_percentage_overall / home / away
Season's losses percentage in second half.
Overall = all games, home = home games only, away = away games only.
gd_2hg_overall / home / away
Season's goal difference in second half.
Overall = all games, home = home games only, away = away games only.
btts_2hg_overall / home / away
Season's both teams to score in second half.
Overall = all games, home = home games only, away = away games only.
btts_2hg_percentage_overall / home / away
Season's percentage of both teams to score in second half.
Overall = all games, home = home games only, away = away games only.
btts_fhg_overall / home / away
Season's both teams to score in first half.
Overall = all games, home = home games only, away = away games only.
btts_fhg_percentage_overall / home / away
Season's percentage of both teams to score in first half.
Overall = all games, home = home games only, away = away games only.
cs_2hg_overall / home / away
Season's clean sheets in second half.
Overall = all games, home = home games only, away = away games only.
cs_2hg_percentage_overall / home / away
Season's clean sheets percentage in second half.
Overall = all games, home = home games only, away = away games only.
fts_2hg_overall / home / away
Season's first to score in second half.
Overall = all games, home = home games only, away = away games only.
fts_2hg_percentage_overall / home / away
Season's first to score percentage in second half.
Overall = all games, home = home games only, away = away games only.
BTTS_both_halves_overall / home / away
Season's both teams to score in both halves.
Overall = all games, home = home games only, away = away games only.
BTTS_both_halves_percentage_overall / home / away
Season's both teams to score percentage in both halves.
Overall = all games, home = home games only, away = away games only.
average_attendance_overall / home / away
Season's average attendance.
Overall = all games, home = home games only, away = away games only.
cornerTimingRecorded_matches_overall / home / away
Timing of the corners recorded.
Overall = all games, home = home games only, away = away games only.
corners_fh_overall / home / away
Seasons first half corners.
Overall = all games, home = home games only, away = away games only.
corners_2h_overall / home / away
Seasons second half corners.
Overall = all games, home = home games only, away = away games only.
corners_fh_avg_overall / home / away
Seasons first half corners.
Overall = all games, home = home games only, away = away games only.
corners_fh_over4_overall - corners_fh_over6_overall / home / away
Seasons Over (4 - 6) first half corners.
Overall = all games, home = home games only, away = away games only.
corners_2h_over4_overall - corners_2h_over6_overall / home / away
Seasons Over (4 - 6) second half corners.
Overall = all games, home = home games only, away = away games only.
corners_fh_over4_percentage_overall - corners_fh_over6_percentage_overall / home / away
Seasons Over (4 - 6) first half corners.
Overall = all games, home = home games only, away = away games only.
corners_2h_over4_percentage_overall - corners_2h_over6_percentage_overall / home / away
Seasons Over (4 - 6) second half corners.
Overall = all games, home = home games only, away = away games only.
attack_num_recoded_matches_overall / home / away
Season's count of attacks recorded per match.
Overall = all games, home = home games only, away = away games only.
dangerous_attacks_avg_overall / home / away
Season's count of dangerous attacks recorder per match.
Overall = all games, home = home games only, away = away games only.
xg_for_overall / home / away
Season's average xg for average.
Overall = all games, home = home games only, away = away games only.
xg_for_avg_overall / home / away
Season's average xg for average.
Overall = all games, home = home games only, away = away games only.
xg_against_avg_overall / home / away
Season's average xg against average.
Overall = all games, home = home games only, away = away games only.
attacks_num_overall / home / away
Number of attacks.
Overall = all games, home = home games only, away = away games only.
seasonScoredOver05Num_overall - seasonScoredOver35Num_overall / home / away
Seasons Over (0.5 - 3.5) scored.
Overall = all games, home = home games only, away = away games only.
seasonScoredOver05PercentageNum_overall - seasonScoredOver35PercentageNum_overall / home / away
Seasons percentage of Over (0.5 - 3.5) scored.
Overall = all games, home = home games only, away = away games only.
seasonConcededOver05Num_overall - seasonConcededOver35Num_overall / home / away
Seasons Over (0.5 - 3.5) Conceded.
Overall = all games, home = home games only, away = away games only.
seasonConcededOver05PercentageNum_overall - seasonConcededOver35PercentageNum_overall / home / away
Seasons percentage of Over (0.5 - 3.5) Conceded.
Overall = all games, home = home games only, away = away games only.
cardTimingRecorded_matches_overall / home / away
Cards timing recorded in match.
Overall = all games, home = home games only, away = away games only.
cardsRecorded_matches_overall / home / away
Cards recorded in match.
Overall = all games, home = home games only, away = away games only.
fh_cards_total_overall / home / away
First half cards total.
Overall = all games, home = home games only, away = away games only.
2h_cards_total_overall / home / away
Second half cards total.
Overall = all games, home = home games only, away = away games only.
fh_cards_for_total_overall / home / away
First half cards for total.
Overall = all games, home = home games only, away = away games only.
2h_cards_for_total_overall / home / away
Second half cards for total.
Overall = all games, home = home games only, away = away games only.
fh_cards_against_total_overall / home / away
First half cards against total.
Overall = all games, home = home games only, away = away games only.
2h_cards_against_total_overall / home / away
Second half cards against total.
Overall = all games, home = home games only, away = away games only.
fh_total_cards_under2_percentage_overall / home / away
First half total cards under 2 percentage.
Overall = all games, home = home games only, away = away games only.
2h_total_cards_under2_percentage_overall / home / away
Second half total cards under 2 percentage.
Overall = all games, home = home games only, away = away games only.
fh_total_cards_2to3_percentage_overall / home / away
First half total cards 2 to 3 percentage.
Overall = all games, home = home games only, away = away games only.
2h_total_cards_2to3_percentage_overall / home / away
Second half total cards 2 to 3 percentage.
Overall = all games, home = home games only, away = away games only.
fh_total_cards_over3_percentage_overall / fhome / away
First half total cards over 3 percentage.
Overall = all games, home = home games only, away = away games only.
2h_total_cards_over3_percentage_overall / home / away
Second half total cards over 3 percentage.
Overall = all games, home = home games only, away = away games only.
fh_half_with_most_cards_total_percentage_overall / home / away
First half with most cards total percentage.
Overall = all games, home = home games only, away = away games only.
2h_half_with_most_cards_total_percentage_overall / home / away
Second half with most cards total percentage.
Overall = all games, home = home games only, away = away games only.
fh_cards_for_over05_percentage_overall / home / away
First half cards for the team, Over 0.5.
Overall = all games, home = home games only, away = away games only.
2h_cards_for_over05_percentage_overall / home / away
Second half cards for the team, Over 0.5.
Overall = all games, home = home games only, away = away games only.
cards_for_overall / home / away
Cards for overall.
Overall = all games, home = home games only, away = away games only.
cards_against_overall / home / away
Cards against overall.
Overall = all games, home = home games only, away = away games only.
cards_for_avg_overall / home / away
Average cards for overall.
Overall = all games, home = home games only, away = away games only.
cards_against_avg_overall / home / away
Average cards against overall.
Overall = all games, home = home games only, away = away games only.
cards_total_overall / home / away
Total cards.
Overall = all games, home = home games only, away = away games only.
cards_total_avg_overall / home / away
Average total cards.
Overall = all games, home = home games only, away = away games only.
penalties_won_overall / home / away
Penatlies won.
Overall = all games, home = home games only, away = away games only.
penalties_scored_overall / home / away
Penatlies scored.
Overall = all games, home = home games only, away = away games only.
penalties_missed_overall / home / away
Penalties missed.
Overall = all games, home = home games only, away = away games only.
penalties_won_per_match_overall / home / away
Penalties won per match.
Overall = all games, home = home games only, away = away games only.
penalties_recorded_matches_overall / home / away
Penalties recorded per match.
Overall = all games, home = home games only, away = away games only.
exact_team_goals_0_ft_overall - exact_team_goals_3_ft_overall / home / away
Number of times the team scored exactly (0 - 3) goals at full time.
Overall = all games, home = home games only, away = away games only.
match_shots_over225_num_overall - match_shots_over265_num_overall / home / away
Count of match shots Over (22.5 - 26.5).
Overall = all games, home = home games only, away = away games only.
match_shots_over225_percentage_overall - match_shots_over265_percentage_overall / home / away
Percentage of match shots Over (22.5 - 26.5).
Overall = all games, home = home games only, away = away games only.
match_shots_on_target_over75_num_overall - match_shots_on_target_over95_num_overall / home / away
Number of match shots Over (7.5 - 9.5).
Overall = all games, home = home games only, away = away games only.
match_shots_on_target_over75_percentage_overall - match_shots_on_target_over95_percentage_overall / home / away
Percentage of match shots Over (7.5 - 9.5).
Overall = all games, home = home games only, away = away games only.
team_shots_over105_num_overall - team_shots_over155_num_overall / home / away
Number of team shots Over (10.5 - 15.5).
Overall = all games, home = home games only, away = away games only.
team_shots_over105_percentage_overall - team_shots_over155_percentage_overall / home / away
Percentage of team shots Over (10.5 - 15.5).
Overall = all games, home = home games only, away = away games only.
team_shots_on_target_over35_num_overall - team_shots_on_target_over65_num_overall / home / away
Number of team shots on target Over (3.5 - 6.5).
Overall = all games, home = home games only, away = away games only.
team_shots_on_target_over35_percentage_overall - team_shots_on_target_over65_percentage_overall / home / away
Percentage of team shots on target Over (3.5 - 6.5).
Overall = all games, home = home games only, away = away games only.
win_0_10_num_overall / home / away
Win count between minute 0 and 10, this parameter does not inherit the score of the game and focuses only on the first 0 to 10 minutes.
Overall = all games, home = home games only, away = away games only.
draw_0_10_num_overall / home / away
Draw count between minute 0 and 10, this parameter does not inherit the score of the game and focuses only on the first 0 to 10 minutes.
Overall = all games, home = home games only, away = away games only.
loss_0_10_num_overall / home / away
Loss count between minute 0 and 10, this parameter does not inherit the score of the game and focuses only on the first 0 to 10 minutes.
Overall = all games, home = home games only, away = away games only.
win_0_10_percentage_overall / home / away
Win percentage between minute 0 and 10, this parameter does not inherit the score of the game and focuses only on the first 0 to 10 minutes.
Overall = all games, home = home games only, away = away games only.
draw_0_10_percentage_overall / home / away
Draw percentage between minute 0 and 10, this parameter does not inherit the score of the game and focuses only on the first 0 to 10 minutes.
Overall = all games, home = home games only, away = away games only.
loss_0_10_percentage_overall / home / away
Loss percentage between minute 0 and 10, this parameter does not inherit the score of the game and focuses only on the first 0 to 10 minutes.
Overall = all games, home = home games only, away = away games only.
total_goal_over05_0_10_num_overall / home / away
Count of over 0.5 goals between minute 0 and 10.
Overall = all games, home = home games only, away = away games only.
total_corner_over05_0_10_num_overall / home / away
Count of over 0.5 corners between minute 0 and 10.
Overall = all games, home = home games only, away = away games only.
total_goal_over05_0_10_percentage_overall / home / away
Percentage of over 0.5 goals between minute 0 and 10.
Overall = all games, home = home games only, away = away games only.
total_corner_over05_0_10_percentage_overall / home / away
Percentage of over 0.5 corners between minute 0 and 10.
Overall = all games, home = home games only, away = away games only.
fouls_recorded_overall / home / away
Fouls recorded.
Overall = all games, home = home games only, away = away games only.
fouls_against_num_overall / home / away
Fouls against recorded.
Overall = all games, home = home games only, away = away games only.
fouls_against_avg_overall / home / away
Average fouls against recorded.
Overall = all games, home = home games only, away = away games only.
exact_team_goals_0_ft_percentage_overall - exact_team_goals_3_ft_percentage_overall / home / away
Percentage of (0 - 3) exact team goals.
Overall = all games, home = home games only, away = away games only.
exact_total_goals_0_ft_overall - exact_total_goals_7_ft_overall / home / away
Percentage of (0 - 7) exact team goals.
Overall = all games, home = home games only, away = away games only.
shots_recorded_matches_num_overall / home / away
Number of shots recorded per matches.
Overall = all games, home = home games only, away = away games only.
over25_and_btts_num_overall / home / away
Count of over 2.5 and BTTS.
Overall = all games, home = home games only, away = away games only.
over25_and_no_btts_num_overall / home / away
Count of over 2.5 and NO BTTS.
Overall = all games, home = home games only, away = away games only.
over25_and_btts_percentage_overall / home / away
Percentage of over 2.5 and BTTS.
Overall = all games, home = home games only, away = away games only.
over25_and_no_btts_percentage_overall / home / away
Percentage of over 2.5 and NO BTTS.
Overall = all games, home = home games only, away = away games only.
btts_1h2h_yes_yes_num_overall / home / away
Count of BTTS first half yes & BTTS second half yes.
Overall = all games, home = home games only, away = away games only.
btts_1h2h_yes_no_num_overall / home / away
Count of BTTS first half yes & BTTS second half no.
Overall = all games, home = home games only, away = away games only.
btts_1h2h_no_no_num_overall / home / away
Count of BTTS first half no & BTTS second half no.
Overall = all games, home = home games only, away = away games only.
btts_1h2h_no_yes_num_overall / home / away
Count of BTTS first half no & BTTS second half yes.
Overall = all games, home = home games only, away = away games only.
btts_1h2h_yes_yes_percentage_overall / home / away
Percentage of BTTS first half yes & BTTS second half yes.
Overall = all games, home = home games only, away = away games only.
btts_1h2h_yes_no_percentage_overall / home / away
Percentage of BTTS first half yes & BTTS second half no.
Overall = all games, home = home games only, away = away games only.
btts_1h2h_no_no_percentage_overall / home / away
Percentage of BTTS first half no & BTTS second half no.
Overall = all games, home = home games only, away = away games only.
btts_1h2h_no_yes_percentage_overall / home / away
Percentage of BTTS first half no & BTTS second half yes.
Overall = all games, home = home games only, away = away games only.
half_with_most_goals_is_1h_num_overall / home / away
Number of times the half with most goals was the 1st half.
Overall = all games, home = home games only, away = away games only.
half_with_most_goals_is_tie_num_overall / home / away
Number of times the half with most goals was a tie between 1st and 2nd half.
Overall = all games, home = home games only, away = away games only.
half_with_most_goals_is_2h_num_overall / home / away
Number of times the half with most goals was the 2nd half.
Overall = all games, home = home games only, away = away games only.
half_with_most_goals_is_1h_percentage_overall / home / away
Percentage of times the half with most goals was the 1st half.
Overall = all games, home = home games only, away = away games only.
half_with_most_goals_is_tie_percentage_overall / home / away
Percentage of times the half with most goals was a tie between 1st and 2nd half.
Overall = all games, home = home games only, away = away games only.
half_with_most_goals_is_2h_percentage_overall / home / away
Percentage of times the half with most goals was the 2nd half.
Overall = all games, home = home games only, away = away games only.
shot_conversion_rate_overall / home / away
Shot conversion rate.
Overall = all games, home = home games only, away = away games only.
team_with_most_corners_win_num_overall / home / away
Number of times the team had the most corners.
Overall = all games, home = home games only, away = away games only.
team_with_most_corners_win_1h_num_overall / home / away
Number of times the team had the most corners in 1st half.
Overall = all games, home = home games only, away = away games only.
team_with_most_corners_win_2h_num_overall / home / away
Number of times the team had the most corners in 2nd half.
Overall = all games, home = home games only, away = away games only.
team_with_most_corners_win_percentage_overall / home / away
Percentage of times the team had the most corners in the match.
Overall = all games, home = home games only, away = away games only.
team_with_most_corners_win_1h_percentage_overall / home / away
Percentage of times the team had the most corners in 1st half.
Overall = all games, home = home games only, away = away games only.
team_with_most_corners_win_2h_percentage_overall / home / away
Percentage of times the team had the most corners in 2nd half.
Overall = all games, home = home games only, away = away games only.
corners_earned_1h_num_overall / home / away
Total number of 1st half corner kicks that this team earned this season in this competition.
Overall = all games, home = home games only, away = away games only.
corners_earned_2h_num_overall / home / away
Total number of 2nd half corner kicks that this team earned this season in this competition.
Overall = all games, home = home games only, away = away games only.
corners_earned_1h_avg_overall / home / away
Average number of 1st half corner kicks per match that this team earned this season in this competition. Average = total number divided number of matches.
Overall = all games, home = home games only, away = away games only.
corners_earned_2h_avg_overall / home / away
Average number of 2nd half corner kicks per match that this team earned this season in this competition. Average = total number divided number of matches.
Overall = all games, home = home games only, away = away games only.
corners_earned_1h_over2_num_overall / home / away
Number of times this team has earned more than 2 corner kicks in the 1st half this season.
Overall = all games, home = home games only, away = away games only.
corners_earned_2h_over2_num_overall / home / away
Number of times this team has earned more than 2 corner kicks in the 2nd half this season.
Overall = all games, home = home games only, away = away games only.
corners_earned_1h_over3_num_overall / home / away
Number of times this team has earned more than 3 corner kicks in the 1st half this season.
Overall = all games, home = home games only, away = away games only.
corners_earned_2h_over3_num_overall / home / away
Number of times this team has earned more than 3 corner kicks in the 2nd half this season.
Overall = all games, home = home games only, away = away games only.
corners_earned_1h_2_to_3_num_overall / home / away
Number of times this team has earned 2 or 3 corner kicks in the 1st half this season.
Overall = all games, home = home games only, away = away games only.
corners_earned_2h_2_to_3_num_overall / home / away
Number of times this team has earned 2 or 3 corner kicks in the 2nd half this season.
Overall = all games, home = home games only, away = away games only.
corners_earned_1h_over2_percentage_overall / home / away
Percentage of matches this team has earned more than 2 corner kicks in the 1st half this season.
Overall = all games, home = home games only, away = away games only. Percentage calculation = number of matches of Over 2 corners in 1st half divided by number of matches this team played where corner timings were recorded.
corners_earned_2h_over2_percentage_overall / home / away
Percentage of matches this team has earned more than 2 corner kicks in the 2nd half this season.
Overall = all games, home = home games only, away = away games only. Percentage calculation = number of matches of Over 2 corners in 2nd half divided by number of matches this team played where corner timings were recorded.
corners_earned_1h_over3_percentage_overall / home / away
Percentage of matches this team has earned more than 3 corner kicks in the 1st half this season.
Overall = all games, home = home games only, away = away games only. Percentage calculation = number of matches of Over 3 corners in 1st half divided by number of matches this team played where corner timings were recorded.
corners_earned_2h_over3_percentage_overall / home / away
Percentage of matches this team has earned more than 3 corner kicks in the 2nd half this season.
Overall = all games, home = home games only, away = away games only. Percentage calculation = number of matches of Over 3 corners in 2nd half divided by number of matches this team played where corner timings were recorded.
corners_earned_1h_2_to_3_percentage_overall / home / away
Percentage of matches this team has earned 2 or 3 corner kicks in the 1st half this season.
Overall = all games, home = home games only, away = away games only. Percentage calculation = number of matches of 2 to 3 corners in 1st half divided by number of matches this team played where corner timings were recorded.
corners_earned_2h_2_to_3_percentage_overall / home / away
Percentage of matches this team has earned 2 or 3 corner kicks in the 2nd half this season.
Overall = all games, home = home games only, away = away games only. Percentage calculation = number of matches of 2 to 3 corners in 2nd half divided by number of matches this team played where corner timings were recorded.
penalties_conceded_overall / home / away
Penalty kicks conceded by this team this season.
penalty_in_a_match_overall / home / away
Number of matches where there was at least 1 penalty kick by either team this season.
penalty_in_a_match_percentage_overall / home / away
Percentage of matches where there was at least 1 penalty kick by either team this season.
goal_kicks_recorded_matches_overall / home / away
Number of matches where goal kicks were recorded this season.
goal_kicks_team_num_overall / home / away
Number of goal kicks by this team this season.
goal_kicks_total_num_overall / home / away
Number of total goal kicks by both teams this season.
goal_kicks_team_avg_overall / home / away
Average number of goal kicks per match by this teams this season.
goal_kicks_total_avg_overall / home / away
Average number of total goal kicks per match by both teams this season.
goal_kicks_team_over35_overall ~ goal_kicks_team_over115_overall / home / away
Number of matches where this team performed Over 3.5 ~ Over 11.5 goal kicks this season.
goal_kicks_total_over85_overall ~ goal_kicks_total_over185_overall / home / away
Number of matches where both teams in total performed Over 8.5 ~ Over 18.5 goal kicks this season.
throwins_recorded_matches_overall / home / away
Number of matches where throw-ins were recorded this season.
throwins_team_num_overall / home / away
Number of throw-ins by this team this season.
throwins_total_num_overall / home / away
Number of total throw-ins by both teams this season.
throwins_team_avg_overall / home / away
Average number of throw-ins per match by this teams this season.
throwins_total_avg_overall / home / away
Average number of total throw-ins per match by both teams this season.
throwins_team_over155_overall ~ throwins_team_over245_overall / home / away
Number of matches where this team performed Over 15.5 ~ Over 24.5 goal throw-ins this season.
goals_scored_min_0_to_10 - goals_scored_min_81_to_90
Number of goals scored during this time period. This season
goals_conceded_min_0_to_10 - goals_conceded_min_81_to_90
Number of goals conceded during this time period. This season
goals_all_min_0_to_10 - goals_all_min_81_to_90
Number of goals scored and conceded during this time period. This season. This is in 10 minute increments.
goals_all_min_0_to_15 - goals_all_min_76_to_90
Number of goals scored and conceded during this time period. This season. This is in 15 minute increments.
goals_scored_min_0_to_15 - goals_scored_min_76_to_90
Number of goals scored during this time period. This season. This is in 15 minute increments.
goals_conceded_min_0_to_15 - goals_conceded_min_76_to_90
Number of goals conceded during this time period. This season. This is in 15 minute increments.
goals_scored_min_0_to_10_home - goals_scored_min_81_to_90_home / goals_scored_min_0_to_10_away - goals_scored_min_81_to_90_away
Number of goals scored during this time period. This season at home games only or away games only.
goals_scored_min_0_to_15_home - goals_scored_min_76_to_90_home / goals_scored_min_0_to_15_away - goals_scored_min_76_to_90_away
Number of goals scored during this time period. This season at home games only or away games only. This is in 15 minute increments.
goals_conceded_min_0_to_10_home - goals_conceded_min_81_to_90_home / goals_conceded_min_0_to_10_away - goals_conceded_min_81_to_90_away
Number of goals conceded during this time period. This season at home games only or at away games only.
goals_conceded_min_0_to_15_home - goals_conceded_min_76_to_90_home / goals_conceded_min_0_to_15_away - goals_conceded_min_76_to_90_away
Number of goals scored during this time period. This season at home games only or away games only. This is in 15 minute increments.
goals_all_min_0_to_10_home - goals_all_min_81_to_90_home / goals_all_min_0_to_10_away - goals_all_min_81_to_90_away
Number of goals scored and conceded during this time period. This season at home games only or away games only.
goals_all_min_0_to_15_home - goals_all_min_76_to_90_home / goals_all_min_0_to_15_away - goals_all_min_76_to_90_away
Number of goals scored and conceded during this time period. This season at home games only or at away games only. This is in 15 minute increments.
name_pt - name_fi
Name of the team in the following languages : Spanish, Portuguese, Korean, Turkish, Arabic, Japanese, Russian, German, Swedish, Chinese Traditional, Chinese Simplified, Greek, Polish, Thai, French, Croatian, Czech, Hungarian, Danish, Vietnamese, Slovakian, Bulgarian, Finnish. Not all languages are always available and may default to English depending on availability.
women
1 = Women's team. Null = Men's team
prediction_risk
Prediction Risk represents how often a team scores or concedes goals within close proximity of each other. For example - if Manchester United Scores a goal at min 55', and then concedes immediately at min 58', it will increase their Risk rating. The more times this happens across a single season, the more risk there is of unexpected goals occurring.


Match Details (Stats, H2H, Odds Comparison)
Provides Stats and Trends for a single match. This endpoint includes general stats, H2H data, as well as Odds comparison for a certain match.

Get Match
GEThttps://api.football-data-api.com/match?key=4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756&match_id=1
Sample Response (Access the URL below)
https://api.football-data-api.com/match?key=4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756&match_id=579101
This endpoint provides details on a single match, including stats full odds, and trends. The difference between this and the League Match endpoint is that the Match Details endpoint provides Trends and Lineups of the teams as extra data. Head to Head stats are also provided by default on this endpoint.
Query Parameters
Name
Type
Description
key
*
string
Your API Key
match_id
*
integer
ID of the match. Please get the ID of the match from League Matches endpoint.
200 Successfully retrieved all leagues.Hide ↑Copy
{
    "success": true,
    "pager": {
        "current_page": 1,
        "max_page": 1,
        "results_per_page": 1,
        "total_results": 1
    },
    "data": {
        "id": 579101,
        "homeID": 251,
        "awayID": 145,
        "season": "2019/2020",
        "status": "complete",
        "roundID": 50055,
        "game_week": 11,
        "revised_game_week": -1,
        "homeGoals": [
            "17",
            "43",
            "44"
        ],
        "awayGoals": [],
        "homeGoalCount": 3,
        "awayGoalCount": 0,
        "totalGoalCount": 3,
        "team_a_corners": 7,
        "team_b_corners": 6,
        "totalCornerCount": 13,
        "team_a_offsides": 1,
        "team_b_offsides": 0,
        "team_a_yellow_cards": 1,
        "team_b_yellow_cards": 2,
        "team_a_red_cards": 0,
        "team_b_red_cards": 0,
        "team_a_shotsOnTarget": 7,
        "team_b_shotsOnTarget": 0,
        "team_a_shotsOffTarget": 7,
        "team_b_shotsOffTarget": 6,
        "team_a_shots": 14,
        "team_b_shots": 6,
        "team_a_fouls": 8,
        "team_b_fouls": 12,
        "team_a_possession": 45,
        "team_b_possession": 55,
        "refereeID": 715,
        "coach_a_ID": 497,
        "coach_b_ID": 197,
        "stadium_name": "Bramall Lane (Sheffield)",
        "stadium_location": "",
        "team_a_cards_num": 1,
        "team_b_cards_num": 2,
        "odds_ft_1": 2.4,
        "odds_ft_x": 3.15,
        "odds_ft_2": 3.35,
        "odds_ft_over05": 1.09,
        "odds_ft_over15": 1.48,
        "odds_ft_over25": 2.45,
        "odds_ft_over35": 4.8,
        "odds_ft_over45": 10,
        "odds_ft_under05": 7.5,
        "odds_ft_under15": 2.65,
        "odds_ft_under25": 1.56,
        "odds_ft_under35": 1.18,
        "odds_ft_under45": 1.05,
        "odds_btts_yes": 2,
        "odds_btts_no": 1.69,
        "odds_team_a_cs_yes": 2.5,
        "odds_team_a_cs_no": 1.5,
        "odds_team_b_cs_yes": 3.25,
        "odds_team_b_cs_no": 1.33,
        "odds_doublechance_1x": 1.33,
        "odds_doublechance_12": 1.36,
        "odds_doublechance_x2": 1.57,
        "odds_1st_half_result_1": 3.1,
        "odds_1st_half_result_x": 1.95,
        "odds_1st_half_result_2": 4,
        "odds_2nd_half_result_1": 2.6,
        "odds_2nd_half_result_x": 2.25,
        "odds_2nd_half_result_2": 3.5,
        "odds_dnb_1": 0,
        "odds_dnb_2": 0,
        "odds_corners_over_75": 1.11,
        "odds_corners_over_85": 1.23,
        "odds_corners_over_95": 1.4,
        "odds_corners_over_105": 1.66,
        "odds_corners_over_115": 2,
        "odds_corners_under_75": 5.9,
        "odds_corners_under_85": 3.92,
        "odds_corners_under_95": 2.81,
        "odds_corners_under_105": 2.14,
        "odds_corners_under_115": 1.72,
        "odds_corners_1": 1.4,
        "odds_corners_x": 8.5,
        "odds_corners_2": 3.5,
        "odds_team_to_score_first_1": 1.8,
        "odds_team_to_score_first_x": 7.5,
        "odds_team_to_score_first_2": 2.35,
        "odds_win_to_nil_1": 3.5,
        "odds_win_to_nil_2": 5,
        "odds_1st_half_over05": 1.52,
        "odds_1st_half_over15": 3.6,
        "odds_1st_half_over25": 9.25,
        "odds_1st_half_over35": 21.25,
        "odds_1st_half_under05": 2.39,
        "odds_1st_half_under15": 1.27,
        "odds_1st_half_under25": 1.03,
        "odds_1st_half_under35": 1.01,
        "odds_2nd_half_over05": 1.38,
        "odds_2nd_half_over15": 2.25,
        "odds_2nd_half_over25": 6.2,
        "odds_2nd_half_over35": 13,
        "odds_2nd_half_under05": 3.04,
        "odds_2nd_half_under15": 1.57,
        "odds_2nd_half_under25": 1.12,
        "odds_2nd_half_under35": 1.02,
        "odds_btts_1st_half_yes": 0,
        "odds_btts_1st_half_no": 0,
        "odds_btts_2nd_half_yes": 0,
        "odds_btts_2nd_half_no": 0,
        "overallGoalCount": 3,
        "ht_goals_team_a": 3,
        "ht_goals_team_b": 0,
        "goals_2hg_team_a": 0,
        "goals_2hg_team_b": 0,
        "GoalCount_2hg": 0,
        "HTGoalCount": 3,
        "date_unix": 1572706800,
        "winningTeam": 251,
        "no_home_away": 0,
        "btts_potential": 60,
        "btts_fhg_potential": 20,
        "btts_2hg_potential": 30,
        "goalTimingDisabled": 0,
        "attendance": 31131,
        "corner_timings_recorded": 1,
        "card_timings_recorded": 1,
        "team_a_fh_corners": 2,
        "team_b_fh_corners": 3,
        "team_a_2h_corners": 5,
        "team_b_2h_corners": 3,
        "corner_fh_count": 5,
        "corner_2h_count": 8,
        "team_a_fh_cards": 0,
        "team_b_fh_cards": 1,
        "team_a_2h_cards": 1,
        "team_b_2h_cards": 1,
        "total_fh_cards": 1,
        "total_2h_cards": 2,
        "attacks_recorded": 1,
        "team_a_dangerous_attacks": 47,
        "team_b_dangerous_attacks": 53,
        "team_a_attacks": 101,
        "team_b_attacks": 101,
        "team_a_xg": 1.72,
        "team_b_xg": 0.77,
        "total_xg": 2.49,
        "team_a_penalties_won": 0,
        "team_b_penalties_won": 0,
        "team_a_penalty_goals": 0,
        "team_b_penalty_goals": 0,
        "team_a_penalty_missed": 0,
        "team_b_penalty_missed": 0,
        "pens_recorded": 1,
        "goal_timings_recorded": 1,
        "team_a_0_10_min_goals": 0,
        "team_b_0_10_min_goals": 0,
        "team_a_corners_0_10_min": 2,
        "team_b_corners_0_10_min": 1,
        "team_a_cards_0_10_min": 0,
        "team_b_cards_0_10_min": 0,
        "throwins_recorded": 1,
        "team_a_throwins": 1,
        "team_b_throwins": 0,
        "freekicks_recorded": -1,
        "team_a_freekicks": -1,
        "team_b_freekicks": -1,
        "goalkicks_recorded": -1,
        "team_a_goalkicks": -1,
        "team_b_goalkicks": -1,
        "o45_potential": 0,
        "o35_potential": 10,
        "o25_potential": 40,
        "o15_potential": 60,
        "o05_potential": 100,
        "o15HT_potential": 20,
        "o05HT_potential": 60,
        "o05_2H_potential": 90,
        "o15_2H_potential": 30,
        "corners_potential": 12.6,
        "offsides_potential": 2.4,
        "cards_potential": 4.8,
        "avg_potential": 2.1,
        "home_url": "/clubs/sheffield-united-fc-251",
        "home_image": "teams/england-sheffield-united-fc.png",
        "home_name": "Sheffield United",
        "away_url": "/clubs/burnley-fc-145",
        "away_image": "teams/england-burnley-fc.png",
        "away_name": "Burnley",
        "home_ppg": 1.74,
        "away_ppg": 1.37,
        "pre_match_home_ppg": 1.2,
        "pre_match_away_ppg": 0.6,
        "pre_match_teamA_overall_ppg": 1.3,
        "pre_match_teamB_overall_ppg": 1.2,
        "u45_potential": 100,
        "u35_potential": 90,
        "u25_potential": 60,
        "u15_potential": 40,
        "u05_potential": 0,
        "corners_o85_potential": 90,
        "corners_o95_potential": 80,
        "corners_o105_potential": 70,
        "team_a_xg_prematch": 1.42,
        "team_b_xg_prematch": 1.35,
        "total_xg_prematch": 2.77,
        "match_url": "/england/burnley-fc-vs-sheffield-united-fc-h2h-stats#579101",
        "competition_id": 2012,
        "matches_completed_minimum": 38,
        "lineups": {
            "team_a": [
                {
                    "player_id": 10127,
                    "shirt_number": 1,
                    "player_events": []
                },
                {
                    "player_id": 8515,
                    "shirt_number": 6,
                    "player_events": [
                        {
                            "event_type": "Yellow",
                            "event_time": "89"
                        }
                    ]
                },
                {
                    "player_id": 8697,
                    "shirt_number": 4,
                    "player_events": [
                        {
                            "event_type": "Goal",
                            "event_time": "44"
                        }
                    ]
                },
                {
                    "player_id": 8298,
                    "shirt_number": 7,
                    "player_events": [
                        {
                            "event_type": "Goal",
                            "event_time": "17"
                        },
                        {
                            "event_type": "Goal",
                            "event_time": "43"
                        }
                    ]
                },
                {
                    "player_id": 3964,
                    "shirt_number": 5,
                    "player_events": [
                        {
                            "event_type": "Yellow",
                            "event_time": "34"
                        }
                    ]
                },
                {
                    "player_id": 4305,
                    "shirt_number": 10,
                    "player_events": [
                        {
                            "event_type": "Yellow",
                            "event_time": "68"
                        }
                    ]
                },
                {
                    "player_id": 171045,
                    "shirt_number": 11,
                    "player_events": []
                }
            ]
        },
        "bench": {
            "team_a": [
                {
                    "player_in_id": 8329,
                    "player_in_shirt_number": 10,
                    "player_out_id": 4281,
                    "player_out_time": " 65'",
                    "player_in_events": []
                },
                {
                    "player_in_id": 4225,
                    "player_in_shirt_number": 9,
                    "player_out_id": 7325,
                    "player_out_time": " 75'",
                    "player_in_events": []
                }
            ],
            "team_b": [
                {
                    "player_in_id": 7445,
                    "player_in_shirt_number": 3,
                    "player_out_id": 4040,
                    "player_out_time": " 46'",
                    "player_in_events": []
                },
                {
                    "player_in_id": 4367,
                    "player_in_shirt_number": 12,
                    "player_out_id": 171045,
                    "player_out_time": " 59'",
                    "player_in_events": []
                }
            ]
        },
        "team_a_goal_details": [
            {
                "player_id": 8298,
                "time": "17",
                "extra": null,
                "assist_player_id": 4281
            },
            {
                "player_id": 8298,
                "time": "43",
                "extra": null,
                "assist_player_id": 4281
            },
            {
                "player_id": 8697,
                "time": "44",
                "extra": null,
                "assist_player_id": 4281
            }
        ],
        "team_b_goal_details": [],
        "trends": {
            "home": [
                [
                    "chart",
                    "Coming into this game, Sheffield United has picked up 8 points from the last 5 games, both home and away. That's 1.6 points per game on average. BTTS has landed in just 1 of those games. Sheffield United has scored 4 times in the last 5 fixtures."
                ],
                [
                    "bad",
                    "Just 1 of the last 5 games for Sheffield United has ended with both teams scoring. They have won 2 of those 5 games. Overall, BTTS has landed in 4/10 games for Sheffield United this season."
                ]
            ],
            "away": [
                [
                    "chart",
                    "Coming into this game, Burnley has picked up 7 points from the last 5 games, both home and away. That's 1.4 points per game on average. BTTS has landed in an intriguing 3 of those games. Burnley has scored 8 times in the last 5 fixtures."
                ],
                [
                    "great",
                    "It's likely that Burnley will score today, as they have netted in the last 6 games coming into this one and have scored 8 goals in the last five games."
                ]
            ]
        },
        "homeGoals_timings": [
            "17",
            "43",
            "44"
        ],
        "awayGoals_timings": [],
        "team_a_card_details": [
            {
                "player_id": 8515,
                "card_type": "Yellow",
                "time": "89"
            }
        ],
        "team_b_card_details": [
            {
                "player_id": 3964,
                "card_type": "Yellow",
                "time": "34"
            },
            {
                "player_id": 4305,
                "card_type": "Yellow",
                "time": "68"
            }
        ],
        "h2h": {
            "team_a_id": 251,
            "team_b_id": 145,
            "previous_matches_results": {
                "team_a_win_home": 0,
                "team_a_win_away": 0,
                "team_b_win_home": 3,
                "team_b_win_away": 1,
                "draw": 1,
                "team_a_wins": 0,
                "team_b_wins": 4,
                "totalMatches": 5,
                "team_a_win_percent": 0,
                "team_b_win_percent": 80
            },
            "betting_stats": {
                "over05": 5,
                "over15": 3,
                "over25": 3,
                "over35": 3,
                "over45": 3,
                "over55": 2,
                "btts": 3,
                "clubACS": 0,
                "clubBCS": 2,
                "over05Percentage": 100,
                "over15Percentage": 60,
                "over25Percentage": 60,
                "over35Percentage": 60,
                "over45Percentage": 60,
                "over55Percentage": 40,
                "bttsPercentage": 60,
                "clubACSPercentage": 0,
                "clubBCSPercentage": 40,
                "avg_goals": 3.8,
                "total_goals": 19
            },
            "previous_matches_ids": [
                {
                    "id": 759075,
                    "date_unix": 1293894000,
                    "team_a_id": 145,
                    "team_b_id": 251,
                    "team_a_goals": 4,
                    "team_b_goals": 2
                },
                {
                    "id": 3224310,
                    "date_unix": 1228575600,
                    "team_a_id": 251,
                    "team_b_id": 145,
                    "team_a_goals": 2,
                    "team_b_goals": 3
                }
            ]
        },
        "tv_stations": null,
        "weather": {
            "coordinates": {
                "lat": 53.38,
                "lon": -1.47
            },
            "temperature": {
                "temp": 46.04,
                "unit": "fahrenheit"
            },
            "humidity": "93%",
            "wind": {
                "degree": 250,
                "speed": "11.41 m/s"
            },
            "type": "shower rain",
            "temperature_celcius": {
                "temp": 7.8,
                "unit": "celcius"
            },
            "clouds": "40%",
            "code": "rain",
            "pressure": 974
        },
        "odds_comparison": {
            "FT Result": {
                "1": {
                    "BetFred": "2.38",
                    "10Bet": "2.28",
                    "BetVictor": "2.38",
                    "TitanBet": "2.30",
                    "Planetwin365": "2.26"
                }
            }
        }
    }
}
Queries and Parameters
You can test this API call by using the key "example" and loading the matches from the English Premier League 2018/2019 season (ID: 1625).

Variable Name
Description
id
ID of the match.
homeID
ID of the home team.
awayID
ID of the away team.
season
Season of the league.
status
Status of the match
('complete', 'suspended', 'canceled', 'incomplete').
roundID
Round ID of the match within the season.
game_week
Game week of the match within the season.
homeGoals
Goal timings for home team goals. Array.
awayGoals
Goal timings for away team goals. Array.
homeGoalCount
Number of home team goals.
awayGoalCount
Number of away team goals.
totalGoalCount
Number of total match goals.
team_a_corners
Number of Home Team Corners.
team_b_corners
Number of Away Team Corners.
team_a_offsides
Number of Offsides - Home Team.
team_b_offsides
Number of Offsides - Away Team.
team_a_yellow_cards
Number of yellow cards - Home Team.
team_b_yellow_cards
Number of yellow cards - Away Team.
team_a_red_cards
Number of Red Cards - Home Team.
team_b_red_cards
Number of Red Cards - Away Team.
team_a_shotsOnTarget
Number of Shots On Target - Home Team.
team_b_shotsOnTarget
Number of Shots On Target - Away Team.
team_a_shotsOffTarget
Number of Shots Off Target - Home Team.
team_b_shotsOffTarget
Number of Shots Off Target - Away Team.
team_a_shots
Number of Shots - Home Team.
team_b_shots
Number of Shots - Away Team.
team_a_fouls
Number of Fouls - Home Team.
team_b_fouls
Number of Fouls - Away Team.
team_a_possession
Possession of the Home Team.
team_b_possession
Possession of the Away Team.
refereeID
ID of the referee for this match.
coach_a_ID
ID of the coach for home team.
coach_b_ID
ID of the coach for away team.
stadium_name
Name of the stadium.
stadium_location
Location of the stadium.
team_a_cards_num
Number of cards for home team.
team_b_cards_num
Number of cards for away team.
odds_ft_1
Odds for Home Team Win at FT.
odds_ft_x
Odds for Draw at FT.
odds_ft_2
Odds for Away Team Win at FT.
odds_ft_over05 - odds_ft_over45
Odds for Over 0.5 - 4.5 match goals.
odds_ft_under05 - odds_ft_under45
Odds for Under 0.5 - 4.5 match goals.
odds_btts_yes / no
Odds for BTTS Yes / No.
odds_team_a_cs_yes / a_cs_no / b_cs_yes / b_cs_no
Odds for Clean Sheet Yes / No for Home and Away team.
overallGoalCount
Total number of goals in the match.
ht_goals_team_a
Number of home team goals by HT.
ht_goals_team_b
Number of away team goals by HT.
HTGoalCount
Total number of goals by HT.
date_unix
UNIX timestamp of the match kick off.
winningTeam
ID of the team that won. -1 if draw.
no_home_away
set to 1 if there is no home or away distinction for this match.
btts_potential
Pre-Match Stat for BTTS for both teams. Average between both teams.
o15_potential - o45_potential
Pre-Match Stat for Over 1.5 - 4.5 for both teams. Average between both teams.
o05HT_potential - o15HT_potential
Pre-Match Stat for Over 0.5 - 1.5 for both teams by HT. Average between both teams.
corners_potential
Pre-Match average corners for both teams.
offsides_potential
Pre-Match average offsides for both teams.
cards_potential
Pre-Match average cards for both teams.
avg_potential
Pre-Match average total goals per match for both teams.
corners_o85_potential - corners_o105_potential
Pre-Match Over X Corners for both teams.
u15_potential - u45_potential
Pre-Match Stat for Under 1.5 - 4.5 for both teams. Average between both teams.
home_ppg
Points per game for home team. Current.
away_ppg
Points per game for away team. Current.
pre_match_home_ppg
Pre-Match Points Per Game for Home Team.
pre_match_away_ppg
Pre-Match Points Per Game for Away Team.
competition_id
Season ID of the league.
over05 - over55
Set to true if the match ended with Over X goals.
btts
Set to true if match ended with BTTS.
lineups
Players and their IDs that have participated in this match as the starting 11. Cards and Goal timings are also included.
bench
Players that have started on the bench. Includes time of substitution if substituted. Cards and Goal timings are also included.
trends
Textual representation of statistical trends for team_a (Home) and team_b (Away).
team_a_card_details / team_b_card_details
Yellow/Red Card details - Player ID, Card type, and timing of booking.
h2h
Head to Head stats, including over X, wins, win percentages, previous match scores, and previous match ids.
odds_comparison
Full line of odds.



League Table
Get All Tables for a League Season
GEThttps://api.football-data-api.com/league-tables?key=4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756&season_id=X
Sample Response (Access the URL below)
https://api.football-data-api.com/league-tables?key=4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756&season_id=2012
Returns the data of each team as a JSON array.
Add &include=stats to the request to get the stats of each team !
Query Parameters
Name
Type
Description
max_time
integer
UNIX Timestamp. Set this number if you would like the API to return the stats of the league and the teams up to a certain time. For example, if I enter &max_time=1537984169, then the API will respond with stats as of September 26th, 2019.
key
*
string
Your API Key
season_id
*
integer
ID of the league season that you would like to retrieve.
200 Successfully retrieved all leagues.Hide ↑Copy
{
    "success": true,
    "data": {
        "all_matches_table_overall": [],
        "all_matches_table_home": [],
        "all_matches_table_away": [],
        "specific_tables": [
            {
                "round": "1st Qualifying Round",
                "table": null,
                "groups": null
            },
            {
                "round": "Group Stage",
                "table": null,
                "groups": [
                    {
                        "name": "Group A",
                        "table": [
                            {
                                "id": "76",
                                "seasonGoals_home": 5,
                                "seasonGoals_away": 5,
                                "seasonConceded_away": 2,
                                "seasonConceded_home": 4,
                                "seasonGoals": 10,
                                "points": 11,
                                "seasonConceded": 6,
                                "seasonGoalDifference": 4,
                                "seasonWins_home": 1,
                                "seasonWins_away": 2,
                                "seasonWins_overall": 3,
                                "seasonDraws_home": 1,
                                "seasonDraws_away": 1,
                                "seasonDraws_overall": 2,
                                "seasonLosses_away": 0,
                                "seasonLosses_overall": 1,
                                "seasonLosses_home": 1,
                                "matchesPlayed": 6,
                                "name": "Villarreal CF",
                                "country": null,
                                "cleanName": "Villarreal",
                                "shortHand": "villarreal-cf",
                                "url": "/clubs/spain/villarreal-cf",
                                "seasonURL_overall": "/clubs/spain/villarreal-cf",
                                "seasonURL_home": "/clubs/spain/villarreal-cf",
                                "seasonURL_away": "/clubs/spain/villarreal-cf",
                                "position": 1,
                                "zone": [],
                                "corrections": 0,
                                "wdl_record": "wddwwl"
                            }
                        ]
                    }
                ]
            }
        ]
    }
}
Queries and Parameters
You can test this API call by using the key "example" and loading the league tables from the English Premier League 2018/2019 season (ID: 1625).

Variable Name
Description
league_table
If the league only has a single round with no play-off matches (ie Premier League), the League Table is stored here.
Returns NULL if the league is a Cup format.
all_matches_table_overall
Full table across all matches played during the season. For example, if this is a cup competition, then we will generate a table with all teams across all the matches that they've played. This is not necessarily the league table.
all_matches_table_home / all_matches_table_away
Full table only taking into account either Home matches or Away matches.
specific_tables
Array. Contains tables for each round of a season. Many leagues in the world have multiple rounds with league tables during 1 season.

ie Uruguay Primera Division:
Apertura - Table.
Intermediate Round - Group Tables.
Clausura - Table.
Final Play-Offs - NULL (no table).

ie Championship :
Regular Season - Table.
Play-Offs - NULL (no table).
ie UEFA Champions League.
Qualification Matches - NULL (no table).
Group Round - Table for each group.
8th Finals - NULL (no table).
Quarter Finals - NULL (no table).



Player - Individual
Individual Player Endpoint. Provides stats for the player on a per season/league basis.

Get Player
GEThttps://api.football-data-api.com/player-stats?key=4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756&player_id=*
Returns an array of player stats across all seasons and leagues that they've played in.
Query Parameters
Name
Type
Description
key
*
string
Your API Key
player_id
*
integer
ID of the player that you would like to retrieve. Often obtained via League Players endpoint.
200 Successfully retrieved all leagues.Hide ↑Copy
{
    "success": true,
    "data": [
        {
            "id": "3171",
            "competition_id": "6",
            "full_name": "Cristiano Ronaldo dos Santos Aveiro",
            "first_name": "Cristiano Ronaldo",
            "last_name": "dos Santos Aveiro",
            "known_as": "Cristiano Ronaldo",
            "shorthand": "cristiano-ronaldo",
            "age": "33",
            "league": "UEFA Champions League",
            "league_type": "Cup",
            "season": "2016/2017",
            "starting_year": "2016",
            "ending_year": "2017",
            "national_team_id": "0",
            "url": "/players/portugal/cristiano-ronaldo",
            "club_team_id": "84",
            "club_team_2_id": "-1",
            "position": "Forward",
            "minutes_played_overall": "1170",
            "minutes_played_home": "540",
            "minutes_played_away": "630",
            "birthday": "476438400",
            "nationality": "Portugal",
            "continent": "eu"
        }
    ]
}
Queries and Parameters
You can test this API call by using the key "example" and loading the matches from the English Premier League 2018/2019 season (ID: 1625).

Variable Name
Description
id
ID of the Player.
competition_id
ID of the season (and League) that the stats are based out of.
full_name / first_name / last_name
Name of the player.
known_as
Common name of the player.
shorthand
Programming friendly representation of the player's full name.
age
Current age.
league
Name of the league.
league_type
Type of the league.
season
Season year of the league.
starting_year / ending_year
Starting / Ending year of the league.
url
FootyStats URL of the player.
club_team_id
Team ID of the club that the player was in during this season.
club_team_2_id
Team ID of the club that the player has transferred to during this season.
position
Position of the player.
minutes_played_overall / home / away
Minutes played in this league this season.
birthday
UNIX representation of the player birthday.
nationality
Nationality of the player.
continent
Continent from which the player is from.
appearances_overall / home / away
Number of matches played.
goals_overall / home / away
Number of goals scored.
clean_sheets_overall / home / away
Number of clean sheets for this player's team for the matches that they played in.
conceded_overall / home / away
Number of goals conceded while the player was on the pitch.
assists_overall / home / away
Number of assists this player has earned.
penalty_goals
Number of goals scored via Penalty kick.
goals_involved_per_90_overall
Goals involved (Goals + Assists) per 90 minutes.
assists_per_90_overall
Assists per 90 minutes.
goals_per_90_overall / home / away
Goals scored per 90 minutes.
conceded_per_90_overall
Goals conceded per 90 minutes.
min_per_conceded_overall
Minutes per goal conceded.
cards_overall
Number of Yellow / Red cards earned during this season in this league.
yellow_cards_overall
Number of Yellow cards earned during this season in this league.
red_cards_overall
Number of Red cards earned during this season in this league.
min_per_match
Average number of minutes this player has played per match.
min_per_card_overall
Minutes per card (Yellow / Red).
min_per_assist_overall
Minutes per assist.
cards_per_90_overall
Cards per 90 minutes.
last_match_timestamp
When the last match was played.
detailed / average_rating_overall
Average player rating across all games.
detailed / assists_per_game_overall
Average number of assists per game.
detailed / assists_per90_percentile_overall
Percentile ranking for assists per 90 minutes.
detailed / passes_per_90_overall
Average number of passes per 90 minutes.
detailed / passes_per_game_overall
Average number of passes per game.
detailed / passes_per90_percentile_overall
Percentile ranking for passes per 90 minutes.
detailed / passes_total_overall
Total number of passes made during the season.
detailed / passes_completed_per_game_overall
Average number of completed passes per game.
detailed / passes_completed_total_overall
Total number of completed passes during the season.
detailed / pass_completion_rate_percentile_overall
Percentile ranking for pass completion rate.
detailed / passes_completed_per_90_overall
Completed passes per 90 minutes on average.
detailed / passes_completed_per90_percentile_overall
Percentile ranking for completed passes per 90 minutes.
detailed / short_passes_per_game_overall
Average number of short passes per game.
detailed / long_passes_per_game_overall
Average number of long passes per game.
detailed / key_passes_per_game_overall
Average number of passes that directly lead to a shot on goal per game.
detailed / key_passes_total_overall
Total of passes that directly lead to a shot on goal during the season.
detailed / crosses_per_game_overall
Average number of crosses per game.
detailed / tackles_per_90_overall
Tackles made per 90 minutes on average.
detailed / tackles_per_game_overall
Average number of tackles per game.
detailed / tackles_total_overall
Total number of tackles made during the season.
detailed / tackles_successful_per_game_overall
Average number of successful tackles per game.
detailed / dispossesed_per_game_overall
Average times the player was dispossessed per game.
detailed / saves_per_game_overall
Average number of saves per game (goalkeepers).
detailed / interceptions_per_game_overall
Average number of interceptions per game.
detailed / dribbles_successful_per_game_overall
Average number of successful dribbles per game.
detailed / shots_faced_per_game_overall
Average number of shots faced by the player’s team per game.
detailed / shots_per_goal_scored_overall
Average number of shots taken for each goal scored by the player’s team.
detailed / shots_per_90_overall
Average number of shots taken by the player per 90 minutes played.
detailed / shots_off_target_per_game_overall
Average number of shots off target by the player’s team per game.
detailed / dribbles_per_game_overall
Average number of dribbles made by the player per game.
detailed / shots_on_target_per_game_overall
Average number of shots on target by the player’s team per game.
detailed / xg_per_game_overall
Average expected goals per game for the player’s team.
detailed / aerial_duels_won_per_game_overall
Average number of aerial duels won by the player per game.
detailed / shots_total_overall
Total number of shots taken by the player’s team across all matches.
detailed / shots_per_game_overall
Average number of shots taken by the player per game.
detailed / shots_per90_percentile_overall
Percentile rank for the player’s shots per 90 minutes compared to others.
detailed / shots_on_target_total_overall
Total number of shots on target by the player’s team across all matches.
detailed / shots_on_target_per_90_overall
Average number of shots on target by the player’s team per 90 minutes played.
detailed / shots_on_target_per90_percentile_overall
Percentile rank for the player’s shots on target per 90 minutes compared to others.
detailed / shots_off_target_total_overall
Total number of shots off target by the player’s team across all matches.
detailed / shots_off_target_per_90_overall
Average number of shots off target by the player’s team per 90 minutes played.
detailed / shots_off_target_per90_percentile_overall
Percentile rank for the player’s shots off target per 90 minutes compared to others.
detailed / games_subbed_out
Total number of games where the player was substituted out.
detailed / games_subbed_in
Total number of games where the player was substituted in.
detailed / games_started
Total number of games where the player started the match.
detailed / tackles_per90_percentile_overall
Percentile rank for the player’s tackles per 90 minutes compared to others.
detailed / tackles_successful_per_90_overall
Average number of successful tackles made by the player per 90 minutes played.
detailed / tackles_successful_per90_percentile_overall
Percentile rank for the player’s successful tackles per 90 minutes compared to others.
detailed / tackles_successful_total_overall
Total number of successful tackles made by the player’s team across all matches.
detailed / interceptions_total_overall
Total number of interceptions made by the player’s team across all matches.
detailed / interceptions_per_90_overall
Average number of interceptions made by the player per 90 minutes played.
detailed / interceptions_per90_percentile_overall
Percentile rank for the player’s interceptions per 90 minutes compared to others.
detailed / crosses_total_overall
Total number of crosses attempted by the player’s team across all matches.
detailed / cross_completion_rate_percentile_overall
Percentile rank for the player’s cross completion rate compared to others.
detailed / crosses_per_90_overall
Average number of crosses attempted by the player per 90 minutes played.
detailed / crosses_per90_percentile_overall
Percentile rank for the player’s crosses per 90 minutes compared to others.
detailed / key_passes_per_90_overall
Average number of key passes made by the player per 90 minutes played.
detailed / key_passes_per90_percentile_overall
Percentile rank for the player’s key passes per 90 minutes compared to others.
detailed / dribbles_total_overall
Total number of dribbles made by the player’s team across all matches.
detailed / dribbles_per_90_overall
Average number of dribbles made by the player per 90 minutes played.
detailed / dribbles_per90_percentile_overall
Percentile rank for the player’s dribbles per 90 minutes compared to others.
detailed / dribbles_successful_total_overall
Total number of successful dribbles made by the player’s team across all matches.
detailed / dribbles_successful_per_90_overall
Average number of successful dribbles made by the player per 90 minutes played.
detailed / dribbles_successful_percentage_overall
Percentage of successful dribbles made by the player’s team across all matches.
detailed / saves_total_overall
Total number of saves made by the player across all matches.
detailed / save_percentage_percentile_overall
Percentile rank for the player’s save percentage compared to others.
detailed / saves_per_90_overall
Average number of saves made by the player per 90 minutes played.
detailed / saves_per90_percentile_overall
Percentile rank for the player’s saves per 90 minutes compared to others.
detailed / shots_faced_total_overall
Total number of shots faced by the player’s team across all matches.
detailed / shots_per_goal_conceded_overall
Average number of shots faced for each goal conceded by the player’s team.
detailed / conceded_per90_percentile_overall
Percentile rank for the player’s goals conceded per 90 minutes compared to others.
detailed / shots_faced_per_90_overall
Average number of shots faced by the player’s team per 90 minutes played.
detailed / shots_faced_per90_percentile_overall
Percentile rank for the player’s shots faced per 90 minutes compared to others.
detailed / save_percentage_overall
Save percentage for the player’s team across all matches.
detailed / xg_total_overall
Total expected goals accumulated by the player across all matches.
detailed / pass_completion_rate_overall
Percentage of completed passes out of total attempted by the player.
detailed / shot_accuraccy_percentage_overall
Percentage of shots on target out of total shots taken by the player.
detailed / shot_accuraccy_percentage_percentile_overall
Percentile rank of player’s shot accuracy compared to others.
detailed / dribbled_past_per90_percentile_overall
Percentile rank for times the player was dribbled past per 90 minutes.
detailed / dribbled_past_per_game_overall
Average number of times the player was dribbled past per game.
detailed / dribbled_past_per_90_overall
Average number of times the player was dribbled past per 90 minutes.
detailed / dribbled_past_total_overall
Total number of times the player was dribbled past across all matches.
detailed / dribbles_successful_per90_percentile_overall
Percentile rank for successful dribbles per 90 minutes by the player.
detailed / dribbles_successful_percentage_percentile_overall
Percentile rank for success rate of the player’s dribbles.
detailed / pen_scored_total_overall
Total number of penalties scored by the player.
detailed / pen_missed_total_overall
Total number of penalties missed by the player.
detailed / inside_box_saves_total_overall
Total number of saves made on shots from inside the box.
detailed / blocks_per_game_overall
Average number of blocks made per game by the player.
detailed / blocks_per_90_overall
Average number of blocks made by the player per 90 minutes.
detailed / blocks_total_overall
Total number of blocks made by the player across all matches.
detailed / blocks_per90_percentile_overall
Percentile rank for blocks per 90 minutes made by the player.
detailed / ratings_total_overall
Total number of match ratings recorded for the player.
detailed / clearances_per_game_overall
Average number of clearances made by the player per game.
detailed / clearances_per_90_overall
Average number of clearances made by the player per 90 minutes.
detailed / clearances_total_overall
Total number of clearances made by the player across all matches.
detailed / pen_committed_total_overall
Total number of penalties conceded by the player.
detailed / pen_save_percentage_overall
Percentage of penalties saved by the goalkeeper.
detailed / pen_committed_per_90_overall
Average number of penalties conceded by the player per 90 minutes.
detailed / pen_committed_per90_percentile_overall
Percentile rank for penalties conceded per 90 minutes.
detailed / pen_committed_per_game_overall
Average number of penalties conceded by the player per game.
detailed / pens_saved_total_overall
Total number of penalties saved by the goalkeeper.
detailed / pens_taken_total_overall
Total number of penalties taken by the player.
detailed / hit_woodwork_total_overall
Total number of times the player hit the woodwork with a shot.
detailed / hit_woodwork_per_game_overall
Average number of woodwork hits per game by the player.
detailed / hit_woodwork_per_90_overall
Average number of woodwork hits by the player per 90 minutes.
detailed / punches_total_overall
Total number of times the goalkeeper punched the ball clear.
detailed / punches_per_game_overall
Average number of punches per game made by the goalkeeper.
detailed / punches_per_90_overall
Average number of punches made by the goalkeeper per 90 minutes.
detailed / offsides_per_90_overall
Average number of offsides committed by the player per 90 minutes.
detailed / offsides_per_game_overall
Average number of offsides committed by the player per game.
detailed / offsides_total_overall
Total number of offsides committed by the player.
detailed / penalties_won_total_overall
Total number of penalties won by the player.
detailed / shot_conversion_rate_overall
Percentage of goals scored from total shots taken by the player.
detailed / shot_conversion_rate_percentile_overall
Percentile rank for player’s shot conversion rate.
detailed / minutes_played_percentile_overall
Percentile rank for total minutes played by the player.
detailed / matches_played_percentile_overall
Percentile rank for total matches played by the player.
detailed / min_per_goal_percentile_overall
Percentile rank for minutes per goal scored by the player.
detailed / min_per_conceded_percentile_overall
Percentile rank for minutes per goal conceded (goalkeeper or defender).
detailed / xa_total_overall
Total expected assists (xA) generated by the player.
detailed / xa_per90_percentile_overall
Percentile rank for expected assists per 90 minutes.
detailed / xa_per_game_overall
Average expected assists generated by the player per game.
detailed / xa_per_90_overall
Average expected assists generated by the player per 90 minutes.
detailed / npxg_total_overall
Total non-penalty expected goals (npxG) generated by the player.
detailed / npxg_per90_percentile_overall
Percentile rank for non-penalty expected goals (npxG) per 90 minutes.
detailed / npxg_per_game_overall
Average non-penalty expected goals generated by the player per game.
detailed / npxg_per_90_overall
Average non-penalty expected goals generated by the player per 90 minutes.
detailed / club_team_2_id
Secondary club ID associated with the player (e.g. loan or B team).
detailed / club_team_id
Primary club ID associated with the player.
detailed / fouls_drawn_per90_percentile_overall
Percentile rank for fouls drawn by the player per 90 minutes.
detailed / fouls_drawn_total_overall
Total number of fouls drawn by the player.
detailed / fouls_drawn_per_game_overall
Average number of fouls drawn by the player per game.
detailed / fouls_drawn_per_90_overall
Average number of fouls drawn by the player per 90 minutes.
detailed / fouls_committed_per_90_overall
Average number of fouls committed by the player per 90 minutes.
detailed / fouls_committed_per_game_overall
Average number of fouls committed by the player per game.
detailed / fouls_committed_per90_percentile_overall
Percentile rank for fouls committed by the player per 90 minutes.
detailed / fouls_committed_total_overall
Total number of fouls committed by the player.
detailed / xg_per_90_overall
Average expected goals (xG) generated by the player per 90 minutes.
detailed / xg_per90_percentile_overall
Percentile rank for expected goals (xG) per 90 minutes.
detailed / average_rating_percentile_overall
Percentile rank for the player's average match rating.
detailed / clearances_per90_percentile_overall
Percentile rank for clearances made per 90 minutes.
detailed / hit_woodwork_per90_percentile_overall
Percentile rank for woodwork hits per 90 minutes.
detailed / punches_per90_percentile_overall
Percentile rank for goalkeeper punches per 90 minutes.
detailed / offsides_per90_percentile_overall
Percentile rank for offsides committed per 90 minutes.
detailed / aerial_duels_won_per90_percentile_overall
Percentile rank for aerial duels won per 90 minutes.
detailed / aerial_duels_won_total_overall
Total number of aerial duels won by the player.
detailed / aerial_duels_won_percentage_overall
Percentage of aerial duels won by the player.
detailed / aerial_duels_won_per_90_overall
Average number of aerial duels won by the player per 90 minutes.
detailed / duels_per_90_overall
Average number of total duels contested by the player per 90 minutes.
detailed / duels_per_game_overall
Average number of duels the player engaged in per game.
detailed / duels_total_overall
Total number of duels the player engaged in across all matches.
detailed / duels_won_total_overall
Total number of duels the player won across all matches.
detailed / duels_won_per90_percentile_overall
Percentile ranking of the player's duels won per 90 minutes compared to peers.
detailed / duels_per90_percentile_overall
Percentile ranking of the player's duels per 90 minutes compared to peers.
detailed / duels_won_per_90_overall
Average number of duels the player won per 90 minutes.
detailed / duels_won_per_game_overall
Average number of duels the player won per game.
detailed / duels_won_percentage_overall
Percentage of total duels won by the player.
detailed / dispossesed_total_overall
Total number of times the player lost possession when challenged.
detailed / dispossesed_per_90_overall
Average number of times the player was dispossessed per 90 minutes.
detailed / dispossesed_per90_percentile_overall
Percentile ranking of the player's dispossessions per 90 minutes compared to peers.
detailed / progressive_passes_total_overall
Total number of passes made by the player that moved the ball significantly forward.
detailed / cross_completion_rate_overall
Percentage of successful crosses delivered by the player.
detailed / accurate_crosses_total_overall
Total number of accurate crosses delivered by the player.
detailed / accurate_crosses_per_game_overall
Average number of accurate crosses per game.
detailed / accurate_crosses_per_90_overall
Average number of accurate crosses per 90 minutes.
detailed / accurate_crosses_per90_percentile_overall
Percentile ranking of accurate crosses per 90 minutes compared to peers.
detailed / games_started_percentile_overall
Percentile ranking for the proportion of games the player started.
detailed / games_subbed_in_percentile_overall
Percentile ranking for the frequency the player was substituted into games.
detailed / games_subbed_out_percentile_overall
Percentile ranking for the frequency the player was substituted out of games.
detailed / hattricks_total_overall
Total number of hat-tricks (three goals in a single match) scored by the player.
detailed / two_goals_in_a_game_total_overall
Total number of matches where the player scored two goals.
detailed / three_goals_in_a_game_total_overall
Total number of matches where the player scored three goals.
detailed / two_goals_in_a_game_percentage_overall
Percentage of matches where the player scored two goals.
detailed / three_goals_in_a_game_percentage_overall
Percentage of matches where the player scored three goals.
detailed / goals_involved_per90_percentile_overall
Percentile ranking for goals + assists per 90 minutes compared to peers.
detailed / goals_per90_percentile_overall
Percentile ranking for goals scored per 90 minutes overall.
detailed / goals_per90_percentile_away
Percentile ranking for goals scored per 90 minutes in away matches.
detailed / goals_per90_percentile_home
Percentile ranking for goals scored per 90 minutes in home matches.
detailed / annual_salary_eur
Player's annual salary in euros.
detailed / annual_salary_eur_percentile
Percentile ranking of the player's annual salary compared to peers.
detailed / clean_sheets_percentage_percentile_overall
Percentile ranking of the percentage of matches with clean sheets by player's team.
detailed / min_per_card_percentile_overall
Percentile ranking for average minutes played per card received.
detailed / cards_per90_percentile_overall
Percentile ranking for number of cards received per 90 minutes.
detailed / booked_over05_overall
Total number of matches where the player received more than 0.5 cards.
detailed / booked_over05_percentage_overall
Percentage of matches where the player received more than 0.5 cards.
detailed / booked_over05_percentage_percentile_overall
Percentile ranking for percentage of games with more than 0.5 cards received.
detailed / shirt_number9
Indicates whether the player wears the shirt number 9.
detailed / detailed_minutes_played_recorded_overall
Total minutes played by the player in matches with full data coverage.
detailed / detailed_matches_played_recorded_overall
Total number of matches played by the player with full data coverage.


Referee - Individual
Get Referee
GEThttps://api.football-data-api.com/referee?key=4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756&referee_id=*
Returns an array of stats of the referee for all competitions and seasons they participated in.
Query Parameters
Name
Type
Description
key
*
string
Your API Key
referee_id
*
integer
ID of the referee that you would like to retrieve.
200 Successfully retrieved all leagues.Copy
{
    "success": true,
    "pager": {
        "current_page": 1,
        "max_page": 1,
        "results_per_page": 50,
        "total_results": 33
    },
    "data": [
        {
            "id": 393,
            "competition_id": 4796,
            "full_name": "Michael Oliver",
            "first_name": "Michael",
            "last_name": "Oliver",
            "known_as": "Michael Oliver",
            "shorthand": "michael-oliver",
            "age": 35,
            "league": "UEFA Nations League",
            "league_type": "International",
            "url": "https://footystats.org/referees/england-r-michael-oliver",
            "season": "2020/2021",
            "continent": "",
            "starting_year": 2020,
            "ending_year": 2021,
            "birthday": 477705600,
            "nationality": "England",
            "appearances_overall": 2,
            "wins_home": 0,
            "wins_away": 0,
            "draws_overall": 2,
            "wins_per_home": 0,
            "wins_per_away": 0,
            "draws_per": 100,
            "btts_overall": 50,
            "btts_percentage": 50,
            "goals_overall": 2,
            "goals_home": 1,
            "goals_away": 1,
            "goals_per_match_overall": 1,
            "goals_per_match_home": 0.5,
            "goals_per_match_away": 0.5,
            "penalties_given_overall": 0,
            "penalties_given_home": 0,
            "penalties_given_away": 0,
            "penalties_given_per_match_overall": 0,
            "penalties_given_per_match_home": 0,
            "penalties_given_per_match_away": 0,
            "penalties_given_percentage_overall": 0,
            "penalties_given_percentage_home": 0,
            "penalties_given_percentage_away": 0
        }
    ]
}
Queries and Parameters
This part is still Work in progress, and will be updated at a later date.

Variable Name
Description
id
ID of the Referee.
full_name
Full name of the referee.


BTTS Stats
Get Top Teams, Fixtures, and Leagues for BTTS.

Get Top Teams, Fixtures, and Leagues for BTTS
GEThttps://api.football-data-api.com/stats-data-btts?key=4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756
Returns the data of the best BTTS Leagues, Teams, and Fixtures.
Query Parameters
Name
Type
Description
key
*
string
Your API Key
200 Successfully retrieved all leagues.Hide ↑Copy
{
    "data": {
        "top_teams": {
            "title": "BTTS Teams",
            "list_type": "teams",
            "data": []
        },
        "top_fixtures": {
            "title": "BTTS Fixtures",
            "list_type": "fixtures",
            "data": []
        },
        "top_leagues": {
            "title": "BTTS Leagues",
            "list_type": "leagues",
            "data": []
        }
    }
}
Queries and Parameters
Variable Name
Description
top_teams
Showcases the best BTTS teams.
top_fixtures
Showcases the best BTTS fixtures.
top_leagues
Showcases the best BTTS leagues.
title
Name.
list_type
Either teams, leagues or fixtures.
data
Data related to the best BTTS stats.

Over 2.5 Stats
Get Top Teams, Fixtures, and Leagues for Over 2.5 Goals.

Get Over 2.5 Stats
GEThttps://api.football-data-api.com/stats-data-over25?key=4fd202fbc338fbd450e91761c7b83641606b2a4da37dd1a7d29b4cd1d4de9756
This endpoint allows you to get Over 2.5 data.
Query Parameters
Name
Type
Description
key
*
string
Your API Key
200 Successfully retrieved all leagues.Copy
{
    "success": true,
    "pager": {
        "current_page": 1,
        "max_page": 1,
        "results_per_page": 50,
        "total_results": 3
    },
    "metadata": {
        "request_limit": null,
        "request_remaining": null,
        "request_reset_message": "Request limit is refreshed every hour."
    },
    "data": {
        "top_teams": {
            "title": "Over 2.5 Teams",
            "list_type": "teams",
            "data": []
        },
        "top_fixtures": {
            "title": "Over 2.5 Fixtures",
            "list_type": "fixtures",
            "data": []
        },
        "top_leagues": {
            "title": "Over 2.5 Leagues",
            "list_type": "leagues",
            "data": []
        }
    },
    "message": ""
}
## Get Leagues

### GET
URL: `/leagues`

**Description:** Get all available leagues

**Parameters:**


---


## Get Countries

### GET
URL: `/countries`

**Description:** Returns JSON array of Countries and ISO numbers

**Parameters:**


---


## Get Today's Matches

### GET
URL: `/matches`

**Description:** Get today's matches with or without stats

**Parameters:**
- **date** (string): Date in YYYY-MM-DD format

---

