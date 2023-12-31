package com.ftn.socialNetwork.repository;

import com.ftn.socialNetwork.model.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

  Report findByPostAndUser(Post post, User user);

  Report findByCommentAndUser(Comment comment, User user);

  Report findByReportedUserAndUser(User reportedUser, User user);

  List<Report> findAllByPostIsNotNull();

  List<Report> findAllByCommentIsNotNull();

  List<Report> findAllByReportedUserIsNotNull();
}
