import CareerScoreCard from "./CareerScoreCard";
import ResumeScoreCard from "./ResumeScoreCard";
import SkillProgressCard from "./SkillProgressCard";

export default function StatsGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      <CareerScoreCard />
      <ResumeScoreCard />
      <SkillProgressCard />
    </div>
  );
}