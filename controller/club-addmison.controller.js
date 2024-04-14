const ClubApplication = require('../model/club-addmision');
const User = require('../model/user.model');
const Club = require('../model/club.model');

async function applyForClub(req, res) {
    try {
        const { userId, clubId, reason, contribution } = req.body;

        const existingApplication = await ClubApplication.findOne({ user: userId, club: clubId });
        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this club' });
        }

        const application = new ClubApplication({
            user: userId,
            club: clubId,
            reason,
            contribution
        });
        await application.save();

        res.status(201).json({ message: 'Club application submitted successfully', application });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

async function getClubApplications(req, res) {
    try {
        const { clubId } = req.params;

        // Check if the logged-in user is a club admin
        if (req.user.role !== "club_admin") {
            return res.status(403).json({ message: 'Access Denied: Only club admin can view club applications' });
        }

        // Fetch the club
        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        // Fetch club applications for the specified club
        const applications = await ClubApplication.find({ club: clubId }).populate('user', 'fullName username');
        res.status(200).json({ applications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

async function processClubApplication(req, res) {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;

        // Check if the logged-in user is a club admin
        if (req.user.role !== "club_admin") {
            return res.status(403).json({ message: 'Access Denied: Only club admin can process club applications' });
        }

        const loggedInClubAdminId = req.user._id;
        const clubApplication = await ClubApplication.findById(applicationId).populate('club');
        if (!clubApplication) {
            return res.status(404).json({ message: 'Club application not found' });
        }

        // // Check if the logged-in user is the club admin of the club related to the application
        // if (!clubApplication.club || !clubApplication.club.leader || clubApplication.club.leader.toString() !== loggedInClubAdminId.toString()) {
        //     return res.status(403).json({ message: 'Access Denied: Only club admin of the corresponding club can process club applications' });
        // }

        const updatedApplication = await ClubApplication.findByIdAndUpdate(applicationId, { status }, { new: true });

        if (status === 'approved') {
            await User.findByIdAndUpdate(updatedApplication.user, { role: 'club_member' });
        }

        res.status(200).json({ message: 'Club application processed successfully', application: updatedApplication });
    } catch (error) {
        console.error('Error processing club application:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}

async function getUserApplications(req, res) {
    try {
        const loggedInUserId = req.user._id;

        // Fetch club applications for the specified user
        const applications = await ClubApplication.find({ user: loggedInUserId }).populate('club', 'name status');

        res.status(200).json({ applications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = { applyForClub, getClubApplications, processClubApplication ,getUserApplications};
