import React, { useEffect, useRef } from "react";
import Page from "../page";
import Container from "@material-ui/core/Container";
import { Grid, Typography, Paper } from "@material-ui/core/";
import ideaImg from "../../assets/images/IdeaImage.png";
import ideaStepImg from "../../assets/images/Idea-stepImage.png";
import skylerImg from "../../assets/images/skyler-img.png";
import skylerQuichPitch from "../../assets/images/skyler-quick-pitch.png";
import swotHelp from "../../assets/images/swot-help.png";
import { withRouter, Link } from "react-router-dom";

/* Help page for entrepreneur, how to create quick pitch or investor pitch */
function PitchHelp(props) {
  const quickPitchRef = useRef(null);
  const investorPitchRef = useRef(null);
  const scrollToQuickPitch = () => {
    if (props.location.pathname === "/help/quick-pitch") {
      setTimeout(() => {
        quickPitchRef.current.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
    if (props.location.pathname === "/help/investor-pitch") {
      setTimeout(() => {
        investorPitchRef.current.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };
  useEffect(() => {
    scrollToQuickPitch();
  });

  return (
    <Page className="pitch">
      <Container>
        <Grid container direction="column" className="help-section">
          <Grid item>
            <Typography className="start-title">What is SYP?</Typography>
            <Typography>
              SYP is a fully integrated digital platform that is available
              across devices that allows entrepreneurs to collaborate with
              experts and investors to validate and bring high potential ideas
              to life. It’s a platform which allows stakeholders to Start Right
              and then Do it Right!
            </Typography>

            <Typography>
              Ideas come to all of us at some point in time, and are usually
              triggered by a challenging situation or a problem we witness
              around us. But how many of us really take the initiative to
              validate these ideas, and then further implement them?
            </Typography>
            <Typography>
              Self-doubt, lack of experience and a limit to the resources we
              have, prevents us from taking these ideas ahead. But this needn’t
              be the case anymore. The SYP platform provides simple and
              intuitive tools and an engaging environment for stakeholders to
              collaborate and bring ideas to life including:
            </Typography>
            <ul style={{ listStyle: "none" }}>
              <li>
                <span className="pr-3">&#10003;</span>A diverse pool of industry
                Experts & seasoned Investors
              </li>
              <li>
                <span className="pr-3">&#10003;</span> “Quick Pitch” idea
                listing
              </li>
              <li>
                <span className="pr-3">&#10003;</span> Tools and guidance for
                creating an “Investor Pitch”
              </li>
              <li>
                <span className="pr-3">&#10003;</span> Inherent capability for
                building work teams, communicating and voting
              </li>
              <li>
                <span className="pr-3">&#10003;</span>Advanced communication;
                private and groups chat
              </li>
              <li>
                <span className="pr-3">&#10003;</span>Voting and commenting on
                ideas
              </li>
              <li className="mt-2 mb-2">Coming Soon</li>
              <li>
                <span className="pr-3">&#10003;</span>A rating mechanism which
                allows stakeholders to rate each other
              </li>
              <li>
                <span className="pr-3">&#10003;</span>Project management,
                collaboration, and advanced idea validation tools
              </li>
              <li>
                <span className="pr-3">&#10003;</span>Video-conferencing
                functionality
              </li>
              <li>
                <span className="pr-3">&#10003;</span>Investment and portfolio
                management capability
              </li>
            </ul>
            <Typography>
              So let’s not waste any more time and get started!
            </Typography>
            <Typography className="start-title">
              The SYP Process
            </Typography>
            <Typography>
              You’re strolling through a park and have the most brilliant idea.
              You know this is something that you definitely need to explore
              further, but self-doubt creeps in. What do I do next? Who can help
              me figure out if this idea even makes sense? And even if I’ve
              figured that out, how do I bring it to life?
            </Typography>
            <div className="text-center">
              <img src={ideaImg} className="idea-img" alt="StryRyt process" />
            </div>
            <Typography>
              Validating ideas, and bringing high potential ones to life has
              never been easier. With SYP no special skills are needed, you
              just need to follow a simple process
            </Typography>
            <div className="text-center">
              <img
                src={ideaStepImg}
                className="idea-img"
                alt="StryRyt process steps"
              />
            </div>

            <Typography>
              The SYP environment is designed for efficient communication,
              feedback and collaboration. Explore and experiment! You’ll find
              interesting capabilities and functions which allow for building
              idea level teams, voting on ideas, commenting on and liking
              comments, and participating in private and group chats for
              collaboration. The collaboration then leads to developing a “Quick
              Pitch” and finally a comprehensive “Investor Pitch”.
            </Typography>
          </Grid>
          <Grid item ref={quickPitchRef}>
            <p className="p-4"></p>
            <Typography className="start-title">
              Step 1: The Quick Pitch
            </Typography>
            <Typography>
              The Quick Pitch very quickly and effectively delivers to your
              audience, the Experts, a high level synopsis of your Idea. Name
              your Idea, upload an image representing your Idea, and answer a
              few simple questions, and your Quick Pitch is done!
            </Typography>

            <Typography>
              The following information generates the Quick Pitch:
            </Typography>
            <ol style={{ listStyle: "square", paddingLeft: "5rem" }}>
              <li>Idea name and an image representing the idea</li>
              <li>A brief description of the idea</li>
              <li>Industry the idea belongs to</li>
              <li>The stage the idea is at </li>
              <li>3 simplistic value proposition questions</li>
              <li>The funding requirement </li>
            </ol>
            <Typography>
              There is also the option to invite other founders to join the
              platform and become a member of the ideation team.
            </Typography>
            <Typography>
              To familiarize you with the Quick Pitch process let us explore
              Skyler, and how its founder Jack took it from an idea to launch.
              Jack noticed that in certain remote locations, local inhabitants
              did not have access to clean drinking water or electricity to run
              water purification equipment.
            </Typography>
            <Typography>
              This led to Jack’s idea for developing a solar powered water
              filtration system and he developed his Quick Pitch as under:
            </Typography>
            <ol style={{ paddingLeft: "5rem" }}>
              <li className="pb-1">
                <b>Idea Name:</b> Skyler
              </li>
              <li className="pb-1">
                <b>Upload an image representing your idea:</b>
              </li>

              <img
                src={skylerImg}
                className="idea-img"
                alt="Solar power water"
              />

              <li className="pb-1">
                <b>Brief Description:</b>A Solar Powered Water Filtration System
              </li>
              <li className="pb-1">
                <b>Stage your idea is in:</b> Prototype
              </li>
              <li className="pb-1">
                <b>Industry your idea belongs to:</b> Renewables & Cleantech
              </li>
              <li className="pb-1">
                <b>Value Proposition:</b>
                <ul style={{ listStyleType: "initial", fontSize: "0.8rem" }}>
                  <li className="pb-1">
                    <b>­The problem you are trying to solve </b>
                    Achieving water purification for local residents in remote
                    areas where there is no access to electricity.
                  </li>
                  <li className="pb-1">
                    <b>­The solution you are offering? </b> A portable water
                    filtration system that works on Solar Energy
                  </li>
                  <li className="pb-1">
                    ­<b>The Team: </b> I am a civil engineer who works on
                    projects in remote locations. I have found there are many
                    places around the world where access to clean water is an
                    issue due to lack of power and the necessary equipment and I
                    want to do something about it. I have a friend who is an
                    Electrical Engineer with experience in solar cells and
                    battery technology and he is keen to work with me in
                    developing the Skyler product
                  </li>
                </ul>
              </li>
              <li className="pb-1">
                <b>Total Funding (USD):</b>
                <ul style={{ listStyleType: "initial", fontSize: "0.8rem" }}>
                  <li className="pb-1">
                    <b>­Funding I am looking for: </b>
                    100,000 - 500,000
                  </li>
                  <li className="pb-1">
                    <b>­­Amount of funding already in place: </b> 10,000
                  </li>
                </ul>
              </li>
            </ol>
            <Typography>
              While the above fields are mandatory, if you would like to
              supplement the above information with a video, then you can do
              that as well by using the upload video link.
            </Typography>
            <Typography>
              <b>Here is Jack’s completed Quick Pitch:</b>
            </Typography>
            <Paper className="m-5">
              <img
                src={skylerQuichPitch}
                alt="StryRyt process steps"
                width="100%"
              />
            </Paper>
          </Grid>
          <Grid item>
            <Typography className="start-title pt-4">
              Step 2: Engaging Experts
            </Typography>
            <Typography>
              Our Expert pool consists of highly qualified individuals and their
              credentials are thoroughly validated during the onboarding
              process.
            </Typography>
            <Typography>
              Once your Quick Pitch is created, Experts with experience in
              relevant areas would be attracted to your idea and could choose to
              vote on your idea, leave comments and/or request to work with you
              on your Idea. You also have the ability to search through
              SYP’s Expert directory, identify one or more Experts who
              could contribute to your idea, and send them a request to join
              your ideation team.
            </Typography>
            <Typography>
              To effectively engage Experts, create a Quick Pitch that will draw
              their interest; a clear and concise description of the product or
              service you intend launching accompanied by an image that is
              representative of the idea. You can modify your Quick Pitch at any
              time.
            </Typography>
            <Typography>
              Also, if Experts comment on your idea or request further
              information, well thought out and timely responses will increase
              the likelihood that they want to work with you to help bring your
              idea to life.
            </Typography>
            <Typography>
              Once you have onboarded one or more Experts, it will be up to you
              to ensure they stay engaged. While not a comprehensive list, here
              are some Best Practices to achieve that:
            </Typography>
            <ol style={{ paddingLeft: "5rem" }}>
              <li className="pb-1">
                Firstly, <b>get to know each one of them</b> and their working
                style and preferences; for example, what are their capabilities,
                and what responsibilities they can take on, and personal
                preferences of communication and meeting times.
              </li>
              <li className="pb-1">
                Mutually <b>set expectations;</b> this will reduce the
                possibility of ambiguity and conflict
              </li>
              <li className="pb-1">
                Periodically <b>update them on progress;</b> sharing information
                makes them feel part of the team, and keeps them motivated
              </li>
              <li className="pb-1">
                Time and again <b>Recognize the value</b> they are bringing to
                the team which is another great motivator
              </li>
              <li className="pb-1">
                It is up to you to decide on a <b>compensation</b> model; some
                Experts would be happy with pure recognition in return for their
                advice and work effort, but others may expect to be compensated,
                for example with Equity
              </li>
              <li className="pb-1">
                And lastly but importantly, <b>be a good listener</b> and
                provide feedback when necessary
              </li>
            </ol>
            <Typography>
              You are now along the path to success. Experts will help you to
              formally validate your idea. There is also a level of validation
              from the number of votes, and the positive comments you receive on
              your idea. Once you’ve achieved all the green signals to proceed,
              you may now consider raising some form of early stage or later
              stage venture capital based on the milestones you have achieved.
            </Typography>
            <Typography>
              For this you will need a well-developed Investor Pitch and you
              could collaborate with your co-founders and/or the Expert pool to
              achieve this. SYP provides you with all the templates and
              resources you would need. You also have the option of uploading an
              Investor Pitch you may have created outside the SYP platform.
              Simply save it as a PDF and upload it!
            </Typography>
            <Typography>
              Another option is completing the SYP template and uploading
              specific graphics and images to support your pitch. Yes, the
              platform supports that as well.
            </Typography>
          </Grid>
          <Grid item ref={investorPitchRef}>
            <p className="p-4"></p>
            <Typography className="start-title">
              Step 3: The Investor Pitch
            </Typography>
            <Typography style={{ fontWeight: "bold", fontSize: "0.875rem" }}>
              The Purpose of the Investor Pitch
            </Typography>
            <Typography>
              The Investor pitch is a presentation of an idea to potential
              investors. Entrepreneurs pitch their idea because they need
              resources to bring their idea to life or grow it to the next
              desired level.
            </Typography>
            <Typography>
              Depending on the stage where the idea is at and the resources
              required, different kind of investors would be interested. They
              range from Angle Investors who invest smaller amounts in early
              stage ideas to sophisticated Venture Capital funds who invest in
              well- developed ideas that have graduated to a revenue producing
              business, and are at a stage where further investment is required
              to support growth.
            </Typography>
            <Typography>
              At SYP we know what it’s like to pitch to both Angel
              Investors and Venture Capital funds. Most investors in startups
              have years of experience and don’t need much time to understand
              and select the business ideas they want to invest in. Typical live
              investor presentations don’t go beyond 10 to 15 minutes before the
              investor makes an initial decision to participate, usually subject
              to due diligence, i.e. to verify that the information provided by
              the Entrepreneur is accurate.
            </Typography>
            <Typography>
              We have designed the Investor Pitch template to cover exactly the
              information investors look for, nothing less and nothing more, and
              we help you present your message and information concisely and
              correctly.
            </Typography>
            <Typography>
              The Investor Pitch has distinct sections, and usually all the
              sections apply to most business ideas. If a section does not apply
              to you, it can be omitted, but that will be a rare case.
            </Typography>
            <Typography>
              <b>Important Note:</b> If a section dies not apply to you mark it
              with n/a as all sections required to be completed to proceed to
              publishing. This will ensure that you have not inadvertently
              missed a section.
            </Typography>
            <Typography>
              Again, we will use the example of the water filtration system,
              Skyler, we used to familiarize you with the Quick Pitch.
            </Typography>
            <Typography>
              The first few sections from the Quick Pitch remain and can be
              updated if required. For example, now that Jack has guidance from
              his Expert’s pool, the sections have been updated and this is
              reflected under the “Added” sections below:
            </Typography>
            <ol style={{ paddingLeft: "5rem" }}>
              <li className="pb-1">
                <b>The problem you are trying to solve:</b> Achieving water
                purification for local residents in remote areas where there is
                no access to electricity. <b>Added:</b> We have ascertained
                through our research that this is a wide-spread challenge and a
                great business opportunity with the potential of a positive
                social impact among economically weaker sections of society.
              </li>
              <li className="pb-1">
                <b>The solution you are offering:</b> A portable water
                filtration system that works on Solar Energy. <b>Added:</b> Our
                proto-type is now ready and has been field tested.
              </li>
              <li className="pb-1">
                <b>The Team:</b> [This section was substantially changed since
                the time of the Quick Pitch so it is entirely re-written]
                <br />
                <b>Jack Smith (Founder & CEO):</b> A civil engineer who works on
                construction projects in remote locations. Jack found that there
                are many locations around the world where access to clean water
                is an issue due to lack of power and the necessary equipment and
                decided to do something about it.
                <br />
                <b>Ajay Sharma (Co-founder & Chief Scientist):</b> An Electrical
                Engineer, Ajay and Jack met at University. Ajay has experience
                in solar cells and battery technology, having worked in this
                field for 5+ years, and has worked closely with Jack to develop
                the Skyler prototype.
                <br />
                <b>Jane Roberts (Advisor):</b> Jane is a retired professional
                who worked in senior management roles with companies involved
                with water purification, and met Skyler’s promoters on the
                SYP platform. She has since provided guidance and helped
                the Skyler team with networking which resulted in the
                opportunity to successfully field test the equipment and measure
                performance.
                <br />
                <b>Blake McIntosh (Advisor):</b> Blake is a practicing lawyer
                and clean energy enthusiast who has been a great support in
                setting up the company and on the protype development effort by
                helping with all things legal including patent applications.
                Jane had successfully worked with Blake on another assignment,
                and introduced him to Jack.
              </li>
            </ol>
            <Typography style={{ paddingLeft: "4rem" }}>
              The next few sections were developed by the founders after testing
              the viability of their idea and conducting market research with
              the help of their advisors. We describe a general approach and
              then provide a summary of what Skyler did to achieve an effective
              Investor Pitch.
            </Typography>
            <ol style={{ paddingLeft: "5rem" }} start="4">
              <li className="pb-1">
                <b>Total Funding:</b> The funding requirements can change as
                more information becomes available under the guidance of
                Experts, and this information can be updated accordingly.
              </li>
              <li className="pb-1">
                <b>Describe the market size and penetration strategy:</b> One of
                the first things an investor would consider before investing in
                your business is how big is your Total Addressable Market (TAM).
                That is, the total number of customers that could potentially
                buy your product or service, if you were the only supplier. The
                larger your TAM, the greater the potential of growth for your
                business. After you have estimated your TAM, you can then go on
                to estimate the percentage of the market you will be able to
                capture. This percentage would be directly related to the unique
                features of your service or product, your price point, and how
                aggressively you are able to promote the product. There are
                several online resources that can help you estimate your TAM and
                market penetration, and you may also find an Expert on SYP
                itself who had experience with market analysis in your industry.
                <br />
                Remember to always cite the sources of your data for all kinds
                of quantitative and qualitative analysis so that the accuracy of
                the same can be verified by Investors.
                <br />
                <i>Skyler summary:</i> Jack and his team decided to first
                concentrate on the market in Ghana, West Africa, which is their
                home country, before they expand into neighbouring and then
                foreign markets. They want to grow slowly but surely, and are
                seeking first round Angle investment for supporting the product
                launch and local area market penetration. <br />
                So they gathered data on remote locations in Ghana which are
                populated but lacking electricity and have a known shortage of
                clean drinking water. They then looked at competing alternatives
                to Skyler and estimated the market penetration they could
                achieve over the next 5 years.
              </li>
              <li className="pb-1">
                <b>
                  Describe your Competition Identify & Classify your
                  Competition:
                </b>
                An effective approach is to start with Identifying and
                Classifying the competition. Your competitors are those
                businesses which provide a similar product or service to your
                Target Addressable Market (TAM). Once identified, these
                competitors can be separated into three distinct categories.
                <ul className="pt-1" style={{ listStyle: "square" }}>
                  <li className="pb-1">
                    Your Direct Competition are those businesses which provide
                    very similar products or services to your TAM
                  </li>
                  <li className="pb-1">
                    Your Indirect Competition are those businesses which offer
                    slightly different products or services to your TAM
                  </li>
                  <li className="pb-1">
                    The Other Competition is businesses that offer different
                    products and services to your TAM
                  </li>
                  <li className="pb-1">
                    Secondary or indirect competition Businesses that offer
                    slightly different products and services or target a
                    different clientele within the same territory.
                  </li>
                </ul>
                <b>Get to Know your Competition:</b> Once you’ve identified your
                main competitors, you’ll want to gather as much information as
                possible about them. Evaluate their products and services, what
                are consumers saying about them, what are warranties they offer,
                how are they priced, what promotions do they offer, what is
                their pricing strategy, how are they distributing their
                products, and any other information which will help you achieve
                a good overall picture of the competitive landscape in general.
                <br />
                Some of the primary resources you can use include; speak
                directly to your competition or their stakeholders (consumers,
                retailers etc.), visit them at trade shows, thoroughly go
                through their websites and look for online reviews and ratings.
                <br />
                <b>
                  Compare, Differentiate and Develop Your Unique Value
                  Proposition:
                </b>
                Identify what your Competition is missing out on. For example,
                these could be product features, ease of access for a service,
                and reliability. Figure out how you could differentiate to stand
                out the crowd, in other words, What is your Unique Value
                proposition for the consumer? <br />
                <i>Skyler summary:</i> Jack’s Expert advisor Jane, took the lead
                on developing the Competitor analysis, and her years of
                experience in the industry helped greatly. The team built out a
                list of competing products (filtration equipment) and service
                providers (municipal and private treated water suppliers) and
                performed a deep dive very much in line with what has been
                suggested above.
                <br />
                They then compared what the market had to offer to their own
                proposed product and built their Unique Value Proposition. This
                exercise also helped them identify certain features they could
                incorporate into Skyler that they had not identified earlier.
                Some as simple as the colour choices for the casing that would
                appeal to their consumer base and some technical features like a
                sun tracking system which automatically aligns the solar panel
                to track the maximum intensity of the sun for optimal battery
                charge. The mechanism was available readily from a third party
                supplies they located in South Korea.
              </li>
              <li className="pb-1">
                <b>
                  The SWOT (Strength, Weaknesses, Opportunities & Threats)
                  Analysis:
                </b>
                Now that you have gathered Market and Competitor Information and
                have a good sense of your own offering, you are in a position to
                develop a SWOT. Investors love it when entrepreneurs can
                identify their own weaknesses and potential threats to their
                business model. Once identified, this gives the Entrepreneur the
                opportunity to provide solutions and mitigants. It is typical of
                Investors to identify potential weaknesses in a business model
                expecting the Entrepreneur to have a good solution for tackling
                that. <br />
                <i>Skyler Summary:</i> The SWOT was developed jointly by the
                Skyler team during a brainstorm session which their Expert
                advisor Blake facilitated. The outcome of this exercise is
                available at this link&nbsp;
                <Link to="/detailsIdea/Ji97oA8tkAjtBp34OJiY">
                  Skyler Investor Pitch.
                </Link>
                <br />
                <p className="pt-2">
                  <b>Skyler’s SWOT:</b>
                </p>
                <div className="text-center">
                  <img src={swotHelp} className="idea-img" alt="StryRyt Swot" />
                </div>
              </li>
              <li className="pb-1">
                <b>Why Is this a good time to launch your idea: </b>
                When launching a Product or Service, the timing could be key to
                its success. That is, is there a market need at that point of
                time or in the foreseeable near future? Where it is a net new
                offer, is there a genuine unmet need? Too early to market could
                result in as big a failure as being too late, or being crowded
                out. Did you know that electric cars where in the market as
                early as 1884? But their production couldn’t be sustained as
                electricity distribution, and thus charging capability, was
                limited. Thereafter the internal combustion engine became so
                popular that not much though was given to electric car
                production till more recent times.
                <br />
                <i>Skyler summary:</i> Jack has determined that there is more
                and more awareness of the benefits of drinking purified water,
                even among indigenous groups living in remote areas due to
                contamination of their water supplies, resulting from activities
                such as mining and deforestation. As well, the number of
                infrastructure development products in remote areas has
                increased rapidly, where workers have to be housed. As such the
                timing for such a portable purification system couldn’t be
                better. As well, government subsidies are now available in
                certain jurisdictions to indigenous people to use for
                health-related equipment.
              </li>
              <li className="pb-1">
                <b>The Implementation Model & Value Creation Milestones:</b> In
                this section you would explain briefly how you would bring your
                product or service to life. The different steps required to go
                from concept or prototype to the developed offer, and then how
                you would get it to the client. You would detail all the
                resources and 3rd party partners, if any, required and how you
                would obtain or engage these. Other aspects such as how you
                would deliver warranties and the service model, if required,
                would also be covered. The implementation model needs to be well
                thought of, as good ideas can fail if not properly implemented.
                Early stage investors are particularly interested in the
                founding team’s capability to think through the implementation
                process, and then demonstrate their capability to work through
                all the elements of the process to bring their idea to life.
                <br />
                From the presentation perspective, a timeline approach is
                helpful, where events to date and upcoming events are
                represented along with key Value Creation Milestones. For
                example, when your website is launched or when you hit your
                first 100 customers
                <br />
                <i>Skyler summary:</i> All four on the Skyler team worked
                together under Jack’s leadership to develop an implementation
                plan, which would be executed on once they achieved funding.
                Developing the prototype helped them identify the resources they
                would require, including reliable manufacturers for various
                components. They also identified distribution channels they
                would use, include on-line, and how they would create awareness
                for their product. Consumables like the filter element, spare
                parts, and remote servicing was also given consideration. In the
                Investor Pitch, they represented all the key components of the
                implementation plan along with key milestones.
              </li>
              <li className="pb-1">
                <b>Financial Information:</b> Lastly but most importantly we
                come to the numbers, a key consideration for all investors.
                After being sold on the concept based on all the above
                information, their final decision would be based on the security
                of their invested capital, the return on investment they would
                achieve, and the potential of a successful exit in a given time
                frame.
                <br />
                An acceptable level of security would be ascertained through a
                combination of all the non-financial background information that
                has been provided, which literally gives the investor a sense of
                security in the business model, and through part-ownership of
                the business. Early stage investors will command a higher stake
                in the company as the risks associated with taking an offer from
                concept to implementation are always higher than, for example,
                launching a proven product in a new market.
                <br />
                The founder(s) would need to value their idea/company and offer
                the investor equity in return for their investment dollars.
                Various valuation models are available on the web, and some of
                the Experts available on SYP could also help you with
                achieving a market valuation. In the Investor Pitch, it is
                important to communicate clearly the amount of investment
                required, but the company valuation and how it was arrived at is
                usually a separate discussion.
                <br />
                <b>Financial Projections and Key Ratios:</b> A financial model
                will need to be developed, and at this stage this needn’t be too
                complicated. Investors will look at profitability and the time
                required to achieve profitability (breakeven analysis), Sales
                Revenue generation, Margins, and Cash Flow. That is, is the
                business capable of meeting all its expense requirements from a
                combination of the equity invested and revenue till the time it
                is fully self-sufficient, and thereon, is it capable of
                sustaining growth to stay market relevant.
                <br />
                Another important financial indicator for an investor is
                Customer Acquisition Cost, which takes into account all the
                costs related to creating awareness, marketing and promotions,
                to achieve a target client base. This is a good indicator of how
                efficiently and economically we are converting our Target
                Addressable Market to become clients. If the cost of acquiring
                customer is too high then however good the product or service
                is, the business model is not going to work.
                <br />
                For some Entrepreneurs developing the financial model would be
                simpler than it is for others. As always, Experts with a finance
                or accounting background available on the SYP platform
                could help you work through all the required components.
                <br />
                <b>Source & Use of Funds:</b> Investors would like to see how
                the capital they and others have provided is going to be used.
                That is, the one time and ongoing expenses of the business to
                achieve the business objectives. They would like their
                investment to be used prudently and effectively and this can be
                presented concisely as the “Source and Use of Funds”.
                <br />
                <i>Skyler summary:</i> The Skyler team felt that between the
                four of them they were competent enough to develop the financial
                projections, financial indicators, the investment they were
                seeking and the use of the invested dollars. A summary of the
                financial model they developed, and the source and use of funds
                is presented as part of the investor pitch.&nbsp;
                <Link to="/detailsIdea/Ji97oA8tkAjtBp34OJiY">
                  Skyler Investor Pitch.
                </Link>
              </li>
            </ol>
          </Grid>
          <Grid item>
            <p className="p-4"></p>
            <Typography className="start-title">Engaging Investors</Typography>
            <Typography>
              Our Investor circles includes seasoned individuals and
              organizations who bring years of investment experience to the
              platform.
            </Typography>
            <Typography>
              Once your Investor Pitch is ready and reviewed, “Publish” it to
              make it visible to Investors. Investors can set filters to refine
              their search for ideas, for example, based on Industry and
              Geography. Based on the criteria match, Investors will be notified
              of your pitch, and could choose to explore it. They can vote on
              your idea, leave comments and/or request to have a discussion with
              you prior to investing in your proposal.
            </Typography>
            <Typography>
              Investors have the capability of keeping their profiles Public or
              Private. You also have the ability to search through SYP’s
              Investor directory to view Investor profiles that are public,
              identify one or more Investors who could be interested in your
              idea, and then send them a request to consider your idea.
            </Typography>
            <Typography>
              To effectively engage Investors, create a good quality Investor
              Pitch that is complete in all respects and allows Investors to get
              a comprehensive picture of the service or product you desire to
              launch. This doesn’t mean it should be pages and pages of
              information. Stick to the suggested guidelines and templates we
              have provided. Where necessary make modifications.
            </Typography>
            <Typography>
              As with Experts, if Investors comment on your idea or request
              further information, well thought out and timely responses will
              increase the likelihood that they will invest in your idea!
            </Typography>
            <Typography>
              Once you have onboarded one or more Investors, it will be up to
              you to ensure they stay engaged. As we did for the effective
              engagement of Experts, here is a list of Best Practices which will
              help you keep Investors engaged:
            </Typography>
            <ol style={{ paddingLeft: "5rem" }}>
              <li className="pb-1">
                Firstly, <b>get to know</b> the Investor before reaching out by
                ascertaining their investment mandate and areas of interest from
                their profiles.
              </li>
              <li className="pb-1">
                <b>Communicate</b> with them based on their communication
                preferences; Investors are extremely busy, and are being
                constantly sent investment opportunities.
              </li>
              <li className="pb-1">
                As recommended earlier, make sure your <b>Investor Pitch</b>
                provides them with all the information they would need, which
                will expedite their decisioning process.
              </li>
              <li className="pb-1">
                Always <b>be a good listener</b> and accept feedback in good
                spirit.
              </li>
            </ol>
            <Typography>
              Good luck on your new venture! SYP is always here to support
              you through the process.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export default withRouter(PitchHelp);
