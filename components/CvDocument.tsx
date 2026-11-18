import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { Site } from "@/lib/types";

const ACCENT = "#a4133c";
const INK = "#14161c";
const BODY = "#3c3e47";
const MUTED = "#6a6d78";
const RULE = "#e6e6ea";

const styles = StyleSheet.create({
  page: {
    paddingTop: 42,
    paddingBottom: 38,
    paddingHorizontal: 44,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: BODY,
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 24,
    lineHeight: 1.08,
    color: INK,
    letterSpacing: -0.4,
  },
  role: {
    fontSize: 10,
    lineHeight: 1.25,
    color: ACCENT,
    fontFamily: "Helvetica-Bold",
    marginTop: 4,
  },
  contact: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 9,
    fontSize: 8.4,
    lineHeight: 1.35,
    color: MUTED,
  },
  contactItem: {
    marginRight: 12,
  },
  rule: {
    height: 1,
    backgroundColor: RULE,
    marginVertical: 12,
  },
  section: {
    marginTop: 13,
  },
  heading: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7.8,
    letterSpacing: 1.3,
    color: ACCENT,
    textTransform: "uppercase",
    marginBottom: 5.5,
  },
  text: {
    fontSize: 9.1,
    lineHeight: 1.5,
    color: BODY,
  },
  skillRow: {
    flexDirection: "row",
    marginBottom: 2.5,
  },
  skillKey: {
    width: 118,
    fontFamily: "Helvetica-Bold",
    fontSize: 8.7,
    color: INK,
  },
  skillVal: {
    flex: 1,
    fontSize: 8.7,
    color: BODY,
  },
  item: {
    marginBottom: 10,
  },
  itemHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  itemTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.3,
    color: INK,
  },
  itemMeta: {
    fontFamily: "Helvetica",
    fontSize: 8,
    color: MUTED,
  },
  itemSub: {
    fontSize: 8.7,
    color: ACCENT,
    fontFamily: "Helvetica-Bold",
  },
  itemDesc: {
    fontSize: 8.7,
    color: BODY,
    marginTop: 1.5,
    lineHeight: 1.45,
  },
  tech: {
    fontSize: 7.8,
    color: MUTED,
    marginTop: 2,
  },
  bulletRow: {
    flexDirection: "row",
    marginTop: 1.5,
  },
  bulletDot: {
    width: 8,
    fontSize: 8,
    color: ACCENT,
  },
  bulletText: {
    flex: 1,
    fontSize: 8.6,
    color: BODY,
    lineHeight: 1.4,
  },
  eduRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  eduDate: {
    width: 76,
    fontSize: 7.8,
    color: MUTED,
    fontFamily: "Helvetica-Bold",
  },
  eduBody: {
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 18,
    left: 42,
    right: 42,
    fontSize: 6.8,
    color: "#a3a6b0",
    textAlign: "center",
  },
});

function ContactItem({ text, href }: { text: string; href?: string }) {
  return (
    <Text style={styles.contactItem}>
      {href ? (
        <Link src={href} style={{ color: MUTED, textDecoration: "none" }}>
          {text}
        </Link>
      ) : (
        text
      )}
    </Text>
  );
}

export default function CvDocument({
  site,
  portfolioUrl,
}: {
  site: Site;
  portfolioUrl?: string;
}) {
  const { profile, skills, experience, education, certifications, languages } =
    site;
  const projects = site.projects;
  const strengths = profile.strengths ?? [];

  return (
    <Document
      title={`${profile.name} — CV`}
      author={profile.name}
      subject={profile.title}
      creator="Portfolio"
    >
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.role}>{profile.title}</Text>
          <View style={styles.contact}>
            <ContactItem text={profile.location} />
            <ContactItem text={profile.email} href={`mailto:${profile.email}`} />
            {profile.showPhone ? <ContactItem text={profile.phone} /> : null}
            {profile.github ? (
              <ContactItem
                text={profile.github.replace(/^https?:\/\/(www\.)?/, "")}
                href={profile.github}
              />
            ) : null}
            {portfolioUrl ? (
              <ContactItem
                text={`Portfolio: ${portfolioUrl
                  .replace(/^https?:\/\/(www\.)?/, "")
                  .replace(/\/$/, "")}`}
                href={portfolioUrl}
              />
            ) : null}
            {profile.linkedin ? (
              <ContactItem
                text={profile.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
                href={profile.linkedin}
              />
            ) : null}
            {profile.website ? (
              <ContactItem
                text={profile.website.replace(/^https?:\/\/(www\.)?/, "")}
                href={profile.website}
              />
            ) : null}
          </View>
        </View>

        <View style={styles.rule} />

        <View>
          <Text style={styles.heading}>Summary</Text>
          <Text style={styles.text}>{profile.summary}</Text>
        </View>

        {skills.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.heading}>Technical Skills</Text>
            {skills.map((group) => (
              <View key={group.group} style={styles.skillRow} wrap={false}>
                <Text style={styles.skillKey}>{group.group}</Text>
                <Text style={styles.skillVal}>{group.items.join(", ")}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {experience.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.heading}>Experience</Text>
            {experience.map((job, index) => (
              <View key={`${job.company}-${index}`} style={styles.item} wrap={false}>
                <View style={styles.itemHead}>
                  <Text style={styles.itemTitle}>{job.role}</Text>
                  <Text style={styles.itemMeta}>
                    {[job.start, job.end].filter(Boolean).join(" – ")}
                  </Text>
                </View>
                <Text style={styles.itemSub}>
                  {job.company}
                  {job.location ? ` · ${job.location}` : ""}
                </Text>
                {job.bullets.map((bullet, bulletIndex) => (
                  <View key={bulletIndex} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
                {job.tech.length > 0 ? (
                  <Text style={styles.tech}>Tech: {job.tech.join(", ")}</Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {projects.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.heading}>Projects</Text>
            {projects.map((project) => (
              <View key={project.slug} style={styles.item} wrap={false}>
                <View style={styles.itemHead}>
                  <Text style={styles.itemTitle}>
                    {project.name}
                    {project.subtitle ? ` — ${project.subtitle}` : ""}
                  </Text>
                  <Text style={styles.itemMeta}>
                    {[project.role, project.year].filter(Boolean).join(" · ")}
                  </Text>
                </View>
                <Text style={styles.itemDesc}>{project.summary}</Text>
                {project.tech.length > 0 ? (
                  <Text style={styles.tech}>
                    Technologies: {project.tech.join(", ")}
                  </Text>
                ) : null}
                {project.url ? (
                  <Text style={styles.tech}>
                    <Link
                      src={project.url}
                      style={{ color: ACCENT, textDecoration: "none" }}
                    >
                      {project.url.replace(/^https?:\/\//, "")}
                    </Link>
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {education.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.heading}>Education</Text>
            {education.map((entry, index) => (
              <View key={`${entry.school}-${index}`} style={styles.eduRow} wrap={false}>
                <Text style={styles.eduDate}>
                  {[entry.start, entry.end].filter(Boolean).join(" – ")}
                </Text>
                <View style={styles.eduBody}>
                  <Text style={styles.itemTitle}>{entry.program}</Text>
                  <Text style={styles.itemDesc}>{entry.school}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {certifications.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.heading}>Certifications & Awards</Text>
            {certifications.map((cert, index) => (
              <View key={`${cert.name}-${index}`} style={styles.skillRow} wrap={false}>
                <Text style={styles.skillKey}>{cert.year}</Text>
                <Text style={styles.skillVal}>
                  {cert.name}
                  {cert.issuer ? ` — ${cert.issuer}` : ""}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {(languages.length > 0 || strengths.length > 0) && (
          <View style={styles.section}>
            {languages.length > 0 ? (
              <View style={styles.skillRow}>
                <Text style={styles.skillKey}>Languages</Text>
                <Text style={styles.skillVal}>{languages.join(", ")}</Text>
              </View>
            ) : null}
            {strengths.length > 0 ? (
              <View style={styles.skillRow}>
                <Text style={styles.skillKey}>Strengths</Text>
                <Text style={styles.skillVal}>{strengths.join(" · ")}</Text>
              </View>
            ) : null}
          </View>
        )}

        <Text style={{ fontSize: 7.6, color: MUTED, marginTop: 14 }}>
          References available upon request.
        </Text>

        <Text style={styles.footer} fixed>
          {profile.name} · {profile.email}
        </Text>
      </Page>
    </Document>
  );
}
